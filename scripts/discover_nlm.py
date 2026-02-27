import asyncio
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    server_params = StdioServerParameters(
        command="python",
        args=["-m", "notebooklm_tools.mcp.server", "--transport", "stdio"],
    )

    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                tools = await session.list_tools()
                
                output = []
                for tool in tools.tools:
                    output.append({
                        "name": tool.name,
                        "description": tool.description,
                        "schema": tool.inputSchema
                    })
                    
                with open("nlm_schema.json", "w", encoding="utf-8") as f:
                    json.dump(output, f, indent=2, ensure_ascii=False)
                    
                print("Schema dumped successfully.")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
