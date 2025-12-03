# Awesome Pizza MCP Server

A Model Context Protocol (MCP) server for interacting with a pizza ordering API.

## Features

- **Get Menu**: Retrieve the daily pizza menu (with or without images)
- **Place Orders**: Submit pizza orders and receive order IDs
- **Check Status**: Track order status by order ID

## Prerequisites

- Python 3.12+
- Running pizza API server at `http://localhost:3000`

## Installation

```bash
uv sync
```

## Usage

Run the MCP server:

```bash
uv run main_stdio.py
```

## Available Tools

- `Test tool` - Hello world test tool
- `Get pizza menu` - Fetch the current menu
- `Get pizza menu with images` - Fetch menu with pizza images
- `make_order` - Place an order with items and quantities
- `check_order_status` - Check order status by ID

## Dependencies

- `mcp[cli]>=1.21.1` - Model Context Protocol framework
- `requests>=2.32.5` - HTTP client for API calls
