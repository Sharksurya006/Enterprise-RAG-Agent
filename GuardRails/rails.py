from pathlib import Path

from nemoguardrails import LLMRails, RailsConfig
from nemoguardrails.rails.llm.options import RailStatus, RailType

BASE_DIR = Path(__file__).resolve().parents[1]
CONFIG_PATH = BASE_DIR / "GuardRails" / "Config"
rails = LLMRails(RailsConfig.from_path(str(CONFIG_PATH)))


async def check_input(text: str):
    res = await rails.check_async(
        [{"role": "user", "content": text}], rail_types=[RailType.INPUT]
    )
    blocked = res.status == RailStatus.BLOCKED
    return blocked, (res.content if blocked else text)


async def check_output(question: str, answer: str):
    res = await rails.check_async(
        [
            {"role": "user", "content": question},
            {"role": "assistant", "content": answer},
        ],
        rail_types=[RailType.OUTPUT],
    )
    blocked = res.status == RailStatus.BLOCKED
    return blocked, (res.content if blocked else answer)