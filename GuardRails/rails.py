from nemoguardrails import LLMRails, RailsConfig
from app.core.config import get_settings
from pathlib import Path 

BASE_DIR = Path(__file__).resolve().parents[1]
settings = get_settings()

CONFIG_PATH = BASE_DIR / "GuardRails" / "Config"
config = RailsConfig.from_path(str(CONFIG_PATH))
rails = LLMRails(config)

async def check_input(text: str):
    res = await rails.generate_async(messages=[{"role": "user", "content": text}])
    print("GUARDRAIL RAW RESPONSE:", res)  # temporary debug line
    blocked = res["content"].startswith("I'm sorry") or getattr(res, "refused", False)
    print("BLOCKED?", blocked)  # temporary debug line
    return blocked, res["content"]

async def check_output(text: str):
    res = await rails.generate_async(messages=[
        {"role": "user", "content": "placeholder"},
        {"role": "assistant", "content": text},
    ])
    blocked = res["content"] != text
    return blocked, res["content"]