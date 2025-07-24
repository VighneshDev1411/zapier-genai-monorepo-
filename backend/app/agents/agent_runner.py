from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory
from langchain.agents import Tool

def run_agent_node(prompt: str, tools: list[callable], memory_enabled: bool = False) -> str:
    """
    Runs a LangChain agent dynamically with the given prompt and tools.

    Args:
        prompt (str): The agent's input prompt (with optional context injected).
        tools (list[callable]): List of LangChain Tool callables (already LangChain Tool-wrapped).
        memory_enabled (bool): Optional flag to enable memory per run.

    Returns:
        str: Final agent output string.
    """

    llm = OpenAI(model = "gpt-3.5-turbo", temperature = 0)

    memory = None
    if memory_enabled:
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
    
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        memory= memory,
        verbose = True
    )

    try: 
        result = agent.run(prompt)
    except Exception as e:
        result = f"[AgentError] {str(e)}"
    return result