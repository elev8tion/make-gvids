# Account Usage

**Source:** https://kling.ai/document-api/api/assets/account-usage

## Overview

API for querying account resource usage, balance, and consumption statistics.

## Endpoints

- **GET** `/v1/account/usage` — Query account usage statistics
- **GET** `/v1/account/balance` — Query account balance
- **GET** `/v1/account/resources` — Query resource package status

### Response includes:
- Remaining balance / resource units
- Resource package expiry information
- Usage statistics by model/type
- Consumption history
