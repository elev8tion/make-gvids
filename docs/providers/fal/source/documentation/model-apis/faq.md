# FAQ

**Source:** https://fal.ai/docs/documentation/model-apis/faq.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# FAQ

Common questions about using fal. If you can't find the answer here, join our [Discord community](https://discord.gg/fal-ai) or [contact support](mailto:support@fal.ai).

<AccordionGroup>
  
    Yes. Every account has a [concurrency limit](/documentation/model-apis/concurrency-limits) that controls how many requests can be processed at the same time. New accounts start at 2 concurrent requests. As you purchase credits, the limit increases automatically up to 40. Requests that exceed your limit are queued and processed as slots free up. For higher limits, [contact sales](https://fal.ai/enterprise#contact-sales).
  

  
    Server errors (HTTP 500+) are never charged. If a runner fails to process your request due to an infrastructure issue, you pay nothing. Client-side errors like invalid inputs (HTTP 422) may still be charged if a runner spent GPU time processing the request before the error was detected.
  

  
    Purchased credits expire 365 days from the date of purchase. Free credits and coupons have variable expiration depending on the specific grant, ranging from 1 week to 1 year. Check the [billing dashboard](https://fal.ai/dashboard/billing) for your current credit balance and expiration dates.
  

  
    No. For Model API endpoints, you are billed only for inference time. Cold start time, including container pull and model loading, is not charged.
  

  
    When your credit balance drops below your account's lock threshold, your account is locked and API requests will be rejected. Add credits from the [billing dashboard](https://fal.ai/dashboard/billing) to unlock your account. Enterprise customers on invoice-based billing are not subject to automatic locking.
  

  
    Generated media files (images, videos, audio) are stored on the [fal CDN](/documentation/model-apis/fal-cdn) and available for at least 7 days by default. You can control the retention period per request using the `X-Fal-Object-Lifecycle-Preference` header. See [Data Retention](/documentation/model-apis/media-expiration) for details. Download and store any files you need to keep long-term.
  

  
    Yes. Media URLs returned by fal (`https://v3.fal.media/...`) are publicly accessible. Anyone with the URL can access the file until it expires. If you need private storage, download the files to your own infrastructure.
  

  
    Each model has its own license. Most models on fal are available for commercial use and are marked with a `Commercial use` badge on the model page. Models marked `Research only` are restricted to non-commercial use. Check the model's page for its specific license.
  

  
    Yes, but you should not expose your API key in client-side code. Set up a [server-side proxy](/documentation/model-apis/inference/proxy-setup) that forwards requests to fal from your backend, keeping your key secure.
  

  
    Yes. [fal Serverless](/documentation/serverless) lets you deploy your own models and applications on fal's GPU infrastructure. You can use any Python framework, bring your own Docker image, and scale automatically. See the [quickstart](/documentation/development/getting-started/quick-start) to get started.
  

  
    fal applies content filters on certain models. If your request triggers a `content_policy_violation` error, the input was flagged by automated safety systems. This is a non-retryable 422 error. See the [error reference](/documentation/model-apis/errors) for details on this and other error types.
  

  
    Models marked `Partner API` are hosted by fal's partners. Percentage discounts do not apply to partner API models, and their availability is managed by the partner.
  

  
    Yes. Invoice-based billing is available for higher-volume customers. [Contact sales](https://fal.ai/enterprise#contact-sales) with details about your expected usage.
  

  
    Yes. [Contact sales](https://fal.ai/enterprise#contact-sales) with information about your expected volume to discuss custom pricing.
  

  
    The one-time code is sent to the primary email on your GitHub account. If you no longer monitor that email, check [GitHub's documentation](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/changing-your-primary-email-address) to find or update it.
  
</AccordionGroup>
