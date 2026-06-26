# Prompt Engineering Guide

**Last updated:** 2026-06

## Overview

Kling AI models are prompt-driven — the quality of your output depends heavily on how you structure your text, reference media, and configure complementary parameters. This guide compiles best practices inferred from the API surface, common patterns, and observed model behavior.

---

## Core Principles

### 1. Be Specific, Not Poetic

Kling models respond better to concrete, visual descriptions than abstract or metaphorical language.

```
❌ Weak: "A beautiful scene in nature"
✅ Strong: "A woman in a red dress walking through a pine forest at golden hour,
   sunlight filtering through branches, camera tracking slowly to the right"
```

### 2. Include Camera Direction

Specify camera movement explicitly — the models understand cinematographic language.

```
"Camera slowly dollies forward as the character turns to face it.
 Shallow depth of field, focus on the subject's eyes.
 Wide establishing shot transitioning to medium close-up."
```

### 3. Describe Motion, Not Just Appearance

Video models need to know *what happens*, not just *what it looks like*.

```
❌ Static: "A castle on a hill at sunset"
✅ Dynamic: "A castle on a hill at sunset. Clouds drift slowly across the sky.
   A flag ripples in the wind on the tallest tower. Torches flicker along
   the outer wall as the camera pushes in."
```

### 4. Use Negative Prompts Strategically

The `negative_prompt` parameter removes unwanted elements. Be specific about what you don't want.

```
Prompt: "A professional headshot in a studio, soft lighting"
Negative: "blurry, distorted face, extra limbs, text overlay, watermark,
          low quality, cartoon, anime, deformed features"
```

---

## Prompt Structure by Task Type

### Text-to-Video

Structure: `[Subject] + [Action/Motion] + [Environment] + [Camera] + [Lighting] + [Mood]`

```python
def build_video_prompt(
    subject: str,
    action: str,
    environment: str = "",
    camera: str = "static shot",
    lighting: str = "natural lighting",
    mood: str = "",
    duration_hint: int = 5,
) -> str:
    """
    Compose a structured video prompt from components.
    Naturally varies detail level based on video duration.
    """
    base = f"{subject}. {action}."

    if environment:
        base += f" {environment}."
    if camera:
        base += f" Camera: {camera}."
    if lighting:
        base += f" {lighting}."
    if mood:
        base += f" Mood: {mood}."

    # Longer videos need more descriptive prompts to maintain consistency
    if duration_hint >= 10:
        base += " The motion is smooth and continuous throughout."

    return base[:2500]  # API limit

# Example
prompt = build_video_prompt(
    subject="A young chef in a bright kitchen",
    action="Kneading dough on a flour-dusted wooden counter, hands moving rhythmically",
    environment="Sunlight streaming through a large window, steam rising from a pot on the stove",
    camera="Slow orbit around the chef, medium shot",
    lighting="Warm natural backlight with soft fill",
    mood="Calm, focused, aspirational",
    duration_hint=10,
)
```

### Image-to-Video (Single Image)

Structure: `[What the subject does] + [What the environment does] + [Camera]`

The first frame is already provided — describe what happens *next*.

```
Prompt: "The person slowly turns their head to look directly at the camera,
  a slight smile forming. Hair moves gently in a breeze. Camera holds steady
  in a close-up portrait framing."
```

### Multi-Shot Storyboard

Use the `multi_prompt` array for up to 6 shots. Each shot is self-contained.

```python
storyboard = [
    {
        "index": 1,
        "prompt": "Shot 1, 2 seconds: Establishing wide shot of a city street at dawn.
                   Empty sidewalks, streetlights still on. Camera tilts up slowly.",
        "duration": "2",
    },
    {
        "index": 2,
        "prompt": "Shot 2, 3 seconds: Close-up of a coffee shop door opening.
                   A barista steps out holding a chalkboard sign. Places it on the sidewalk.
                   Morning light hits their face.",
        "duration": "3",
    },
    {
        "index": 3,
        "prompt": "Shot 3, 2 seconds: Medium shot from across the street. The barista
                   wipes down an outdoor table. A customer approaches, waving.",
        "duration": "2",
    },
]
```

> **Note:** Shot durations must sum to match the total `duration` parameter.

### Text-to-Image

Structure: `[Subject] + [Composition] + [Style/Medium] + [Lighting] + [Color Palette] + [Detail]`

```
"A portrait of an elderly fisherman, weathered face, standing on a wooden dock.
 Rule of thirds composition, subject off-center left, negative space right.
 Photorealistic, cinematic, shot on 35mm film.
 Golden hour backlighting, rim light on shoulders.
 Muted teal and amber color grade.
 Wearing a worn yellow raincoat, holding a coiled rope, sea mist in the air."
```

### Image-to-Image (Style Reference)

```
"Transform this into a watercolor painting style. Soft edges, visible brush
 strokes, slightly desaturated colors, paper texture visible. Keep the original
 composition but render in a loose, expressive watercolor technique."
```

### Talking Avatar / Lip Sync

For avatar/lip-sync, the prompt controls expression and head movement — not speech content (that's in the audio).

```
Avatar prompt: "Speaking calmly and confidently, occasional slight head nods,
  natural eye blinking, slight eyebrow movement for emphasis. Relaxed shoulders,
  facing the camera directly. Professional but warm demeanor."
```

---

## Element & Media Reference Syntax

Kling models support inline references to uploaded elements, images, videos, and voices. Use the `<<<reference>>>` syntax within prompts.

### Element References

Create elements via the Element Management API, then reference them in video prompts:

```
"Make <<<element_1>>> walk through a futuristic city at night.
 <<<element_2>>> follows behind, carrying a glowing device.
 Neon lights reflect on the wet pavement."
```

| Syntax | Meaning | Max per prompt |
|---|---|---|
| `<<<element_N>>>` | Reference to element library item | 3 |
| `<<<image_N>>>` | Reference to uploaded image | Per image_list |
| `<<<video_N>>>` | Reference to uploaded video clip | Per video input |
| `<<<voice_N>>>` | Reference to custom voice | 2 |

### Python: Building Prompt with References

```python
def build_element_prompt(
    base_text: str,
    elements: list[str] = [],
    images: list[str] = [],
    voices: list[str] = [],
) -> tuple[str, list, list, list]:
    """
    Build a prompt with element/image/voice references.
    Returns (prompt, element_list, image_list, voice_list).
    """
    prompt = base_text.replace("{element}", "<<<element_1>>>")
    prompt = prompt.replace("{image}", "<<<image_1>>>")
    prompt = prompt.replace("{voice}", "<<<voice_1>>>")

    element_list = [{"element_id": eid} for eid in elements[:3]]
    image_list = [{"image_url": url} for url in images]
    voice_list = [{"voice_id": vid} for vid in voices[:2]]

    return prompt, element_list, image_list, voice_list
```

---

## Parameter Tuning Guide

### cfg_scale (Creativity vs Fidelity)

Range: `[0, 1]`. Only supported on v3.x models.

| Value | Behavior | Use When |
|---|---|---|
| 0.0 | Maximum creativity, loosely follows prompt | Abstract/artistic outputs |
| 0.3–0.5 | Balanced (default: 0.5) | Most cases |
| 0.7–0.9 | Strong prompt adherence | Product demos, specific actions |
| 1.0 | Strictest adherence to prompt | Instructional content, precise motion |

```python
cfg_scale = 0.3 if style == "artistic" else 0.5 if style == "balanced" else 0.8
```

### image_fidelity / human_fidelity (Face Similarity)

| Parameter | Range | Default | Models | Effect |
|---|---|---|---|---|
| image_fidelity | 0–1 | 0.5 | kling-v1, v1-5 | Face reference matching strength |
| human_fidelity | 0–1 | 0.45 | kling-v1-5 (subject ref) | Facial feature similarity |

Higher values = closer to the reference face, but may look "pasted on." Lower = more natural integration, but less identity preservation.

```python
# Natural portrait: lower fidelity for organic blending
video_params = {"image_fidelity": 0.3}

# ID photo / avatar: higher fidelity for identity preservation
avatar_params = {"human_fidelity": 0.7}
```

### Aspect Ratio Effects on Composition

| Ratio | Best For | Platform |
|---|---|---|
| 16:9 | Landscape, cinematic, most video | YouTube, desktop |
| 9:16 | Vertical, portrait mode | TikTok, Reels, Shorts, Stories |
| 1:1 | Square | Instagram feed, profile |
| 4:3 | Classic photo | Print, photography |
| 3:2 | Standard photo | DSLR-style images |
| 21:9 | Ultrawide cinematic | Film, letterboxed |

> **Video models default to 16:9.** If creating vertical video content, you may need to compose the prompt for a vertical frame (subject centered, aware of the narrow FOV).

---

## Known Behaviors & Workarounds

### Content Moderation (Error 1301)

Certain subjects trigger the content safety filter. To reduce false positives:

- Avoid words associated with violence, weapons, or explicit content — even in negative prompts
- For "action" scenes, use terms like "dynamic movement" instead of "fight" or "battle"
- If a prompt is rejected, try rephrasing with more neutral language. Adding "cinematic" or "stylized" sometimes helps.
- Character consistency: elements help — known-element references pass moderation more reliably than text descriptions of specific people

### Prompt Length vs Quality

- **Under 100 chars:** Too vague → generic outputs with poor composition
- **100–500 chars:** Sweet spot for most video tasks
- **500–1500 chars:** Good for multi-action scenes and cinematic control
- **1500–2500 chars:** For complex multi-subject scenes. Risk: some token budget gets "ignored" if too verbose.

### Multi-Shot Timing

The `multi_prompt[].duration` values must exactly sum to the total `duration` parameter. Mismatches cause errors.

```python
def validate_storyboard(shots: list[dict], total_duration: int) -> bool:
    shot_total = sum(int(s["duration"]) for s in shots)
    if shot_total != total_duration:
        raise ValueError(
            f"Shot durations ({shot_total}s) must match total duration ({total_duration}s)"
        )
    return True
```

### End Frame Transitions

When using `image` + `image_tail` (start frame + end frame), the prompt should describe the *transition* between them:

```
"Seamless morph from {describe start image} to {describe end image}.
 Smooth transformation over the full duration. No jarring cuts.
 The subject gradually changes pose/appearance from the start state
 to the end state."
```

### Native Audio Quality

When enabling `sound: "on"` for native audio generation:

- Prompts with implied sounds produce better audio: "waves crashing," "city traffic," "birds chirping" generate matching ambient sound
- Abstract/scifi prompts may produce generic ambient drones
- Combine with `voice_list` for spoken narration over ambient
- Native audio adds ~50% to cost (see pricing matrix)

---

## Prompt Templates

### Quick-Start Templates

**Product Demo (15s, vertical):**
```
"{product_name}, centered on a clean minimalist background. The product
slowly rotates to show all angles. Soft studio lighting with gradient
background. Camera orbits smoothly. Mood: premium, clean, aspirational."
```

**Travel Montage (10s, horizontal):**
```
"A traveler walking through {location}. {iconic_landmark} visible in background.
Crowds move naturally in time-lapse. Warm golden hour lighting.
Drone shot pulling back to reveal the full landscape. Mood: wanderlust, epic."
```

**Educational Explainer (8s):**
```
"An animated {concept} visualization on a clean whiteboard-style background.
Arrows and labels appear smoothly as the camera pushes in.
Clean vector art style. Bright, even lighting. Mood: clear, professional."
```

**Fashion Lookbook (5s each, vertical):**
```
"The model stands in a {setting}, wearing {outfit_description}.
Slight pose change, fabric moves naturally. Soft directional lighting
from {direction}. Slow push-in camera. Mood: editorial, high-fashion.
Negative: distorted clothing, unnatural poses, cartoon"
```

**Character Dialogue (Avatar, variable):**
```
"The character speaks with {emotion}, making natural hand gestures.
Head tilts slightly when emphasizing points. Eyes maintain contact
with the camera. Relaxed but engaged posture. Neutral studio background."
```
