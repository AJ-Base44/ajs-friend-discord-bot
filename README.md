# AJ's Friend — Discord Bot

Real-time Discord bot that connects the SeeByond server to the **AJ's Friend** AI agent via Base44 SDK. Responds instantly using WebSockets (no polling delay).

## How it works

1. Bot listens to `#💬-chat` in the SeeByond Discord server
2. On each user message, it creates/reuses a Base44 agent conversation for that user
3. Sends the message to the agent and posts the reply back to Discord

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_BOT_TOKEN` | Bot token from Discord Developer Portal |
| `BASE44_APP_ID` | Your Base44 app ID |
| `BASE44_SERVICE_TOKEN` | Base44 service role token |
| `BASE44_API_URL` | Base44 API URL (default: https://app.base44.com) |

## Deploy to Fly.io

```bash
fly auth login
fly launch --no-deploy
fly secrets set DISCORD_BOT_TOKEN=your_token BASE44_APP_ID=your_app_id BASE44_SERVICE_TOKEN=your_token
fly deploy
```
