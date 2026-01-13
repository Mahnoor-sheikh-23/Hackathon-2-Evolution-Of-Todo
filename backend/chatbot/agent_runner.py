"""
AI Agent configuration for the chatbot functionality.
Tries OpenAI API key first, then falls back to OpenRouter API key.
Uses cost-effective models to minimize credit usage.
Direct HTTP requests to avoid library proxy issues.
"""

import os
import asyncio
import json
from typing import Dict, Any, List
import httpx
from .mcp_tools import add_task, list_tasks, complete_task, delete_task, update_task


class ChatBotAgent:
    def __init__(self):
        # Check for OpenAI API key first
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        # Fallback to OpenRouter API key
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

        if not self.openai_api_key and not self.openrouter_api_key:
            print("Warning: No API keys found. OPENAI_API_KEY and OPENROUTER_API_KEY environment variables are not set. Chatbot functionality will be limited.")
            self.mock_mode = True
            self.api_key = None
            self.api_type = None
        elif self.openai_api_key:
            # Use OpenAI with cost-effective model
            self.mock_mode = False
            self.api_key = self.openai_api_key
            self.base_url = "https://api.openai.com/v1"
            self.api_type = "openai"
            self.model = "gpt-3.5-turbo"  # Cost-effective OpenAI model
            print("Using OpenAI API with gpt-3.5-turbo model (cost-effective)")
        else:
            # Use OpenRouter as fallback
            self.mock_mode = False
            self.api_key = self.openrouter_api_key
            self.base_url = "https://openrouter.ai/api/v1"
            self.api_type = "openrouter"
            self.model = "openrouter/auto"  # Auto-routing to cost-effective models
            print("Using OpenRouter API with auto-routing model (cost-effective)")

        # Define the tools that the agent can use
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "title": {
                                "type": "string",
                                "description": "The title of the task"
                            },
                            "description": {
                                "type": "string",
                                "description": "The optional description of the task"
                            }
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "status": {
                                "type": "string",
                                "description": "Optional status filter (all, pending, completed)"
                            }
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as completed",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to complete"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to delete"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update task details",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to update"
                            },
                            "title": {
                                "type": "string",
                                "description": "The new title of the task (optional)"
                            },
                            "description": {
                                "type": "string",
                                "description": "The new description of the task (optional)"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]

    async def process_message(self, user_id: str, message: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Process a user message and return the AI response.

        Args:
            user_id: ID of the user
            message: The message from the user
            conversation_history: Previous messages in the conversation

        Returns:
            Dictionary with response, tool_calls, and other information
        """
        try:
            if self.mock_mode:
                # Return a mock response when API key is not configured
                return {
                    "response": "Chatbot is in demo mode. Please configure OPENROUTER_API_KEY to enable full functionality.",
                    "tool_calls": [],
                    "mock_response": True
                }

            # Prepare messages for the API call
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant that helps users manage their tasks. "
                        "You MUST use the provided tools for ALL task operations: "
                        "add_task, list_tasks, complete_task, delete_task, update_task. "
                        "CRITICAL RULES: "
                        "1. When a user asks to DELETE a task, ALWAYS call the delete_task function with the task_id. "
                        "2. When a user asks to COMPLETE a task, ALWAYS call the complete_task function with the task_id. "
                        "3. When a user asks to LIST tasks, ALWAYS call the list_tasks function with their user_id. "
                        "4. When a user asks to ADD a task, ALWAYS call add_task with title and description. "
                        "5. When a user asks to UPDATE a task, ALWAYS call update_task with the task_id and changes. "
                        "6. If user mentions specific task by name (like 'shopping task'), first list tasks to get the ID, then perform the requested action. "
                        "7. Be concise but friendly in your responses after using the tools. "
                        "8. NEVER respond without using the appropriate tool first when dealing with tasks."
                    )
                }
            ]

            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history:
                    messages.append(msg)

            # Add the current user message
            messages.append({"role": "user", "content": message})

            # Prepare the request payload
            payload = {
                "model": self.model,
                "messages": messages,
                "tools": self.tools,
                "tool_choice": "auto"
            }

            # Make the API call using httpx
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=payload
                )

                if response.status_code != 200:
                    print(f"{self.api_type.upper()} API error: {response.status_code} - {response.text}")

                    # If using OpenAI and it fails, try OpenRouter as fallback
                    if self.api_type == "openai" and self.openrouter_api_key:
                        print("OpenAI failed, falling back to OpenRouter...")
                        fallback_payload = {
                            "model": "openrouter/auto",
                            "messages": messages,
                            "tools": self.tools,
                            "tool_choice": "auto"
                        }

                        fallback_response = await client.post(
                            "https://openrouter.ai/api/v1/chat/completions",
                            headers={
                                "Authorization": f"Bearer {self.openrouter_api_key}",
                                "Content-Type": "application/json"
                            },
                            json=fallback_payload
                        )

                        if fallback_response.status_code == 200:
                            response_data = fallback_response.json()
                        else:
                            print(f"Fallback OpenRouter API error: {fallback_response.status_code} - {fallback_response.text}")
                            return {
                                "response": f"API error: {fallback_response.status_code}",
                                "tool_calls": [],
                                "error": f"API error: {fallback_response.text}"
                            }
                    else:
                        return {
                            "response": f"API error: {response.status_code}",
                            "tool_calls": [],
                            "error": f"API error: {response.text}"
                        }
                else:
                    response_data = response.json()

            # Process the response
            choice = response_data["choices"][0]
            ai_response = choice["message"]

            # Initialize result
            result = {
                "response": ai_response.get("content") or "",
                "tool_calls": []
            }

            # Handle tool calls if any
            if ai_response.get("tool_calls"):
                for tool_call in ai_response["tool_calls"]:
                    function_name = tool_call["function"]["name"]
                    function_args = json.loads(tool_call["function"]["arguments"])  # Safe JSON parsing

                    # Ensure the user_id is always set to the correct value from the chat endpoint
                    # This overrides any user_id that the AI might have generated
                    function_args["user_id"] = user_id

                    # Execute the appropriate tool function
                    if function_name == "add_task":
                        tool_result = add_task(**function_args)  # Not async
                    elif function_name == "list_tasks":
                        tool_result = list_tasks(**function_args)  # Not async
                    elif function_name == "complete_task":
                        tool_result = complete_task(**function_args)  # Not async
                    elif function_name == "delete_task":
                        tool_result = delete_task(**function_args)  # Not async
                    elif function_name == "update_task":
                        tool_result = update_task(**function_args)  # Not async
                    else:
                        tool_result = {"error": f"Unknown function: {function_name}"}

                    result["tool_calls"].append({
                        "name": function_name,
                        "arguments": function_args,
                        "result": tool_result
                    })

                # If there are tool calls but no response content, create a response based on tool results
                if not result["response"] and result["tool_calls"]:
                    # Create a summary response based on the tool results
                    response_parts = []
                    for tool_call in result["tool_calls"]:
                        func_name = tool_call["name"]
                        tool_result = tool_call["result"]

                        if func_name == "list_tasks":
                            if isinstance(tool_result, list) and len(tool_result) > 0:
                                task_list = "\n".join([f"- {task.get('title', 'Untitled')} (ID: {task.get('id')})" for task in tool_result])
                                response_parts.append(f"Here are your tasks:\n{task_list}")
                            else:
                                response_parts.append("You don't have any tasks right now.")
                        elif func_name == "add_task":
                            if "error" not in tool_result:
                                response_parts.append(f"I've added the task: {tool_result.get('title', 'Untitled')}")
                            else:
                                response_parts.append(f"Sorry, I couldn't add the task: {tool_result.get('error', 'Unknown error')}")
                        elif func_name == "complete_task":
                            if "error" not in tool_result:
                                response_parts.append("Task marked as completed!")
                            else:
                                response_parts.append(f"Sorry, I couldn't complete the task: {tool_result.get('error', 'Unknown error')}")
                        elif func_name == "delete_task":
                            if "error" not in tool_result:
                                response_parts.append("Task deleted successfully!")
                            else:
                                response_parts.append(f"Sorry, I couldn't delete the task: {tool_result.get('error', 'Unknown error')}")
                        elif func_name == "update_task":
                            if "error" not in tool_result:
                                response_parts.append("Task updated successfully!")
                            else:
                                response_parts.append(f"Sorry, I couldn't update the task: {tool_result.get('error', 'Unknown error')}")
                        else:
                            response_parts.append(f"Action completed: {func_name}")

                    result["response"] = " ".join(response_parts)

            return result

        except Exception as e:
            print(f"Error in agent processing: {str(e)}")
            return {
                "response": f"I'm sorry, I encountered an error: {str(e)}",
                "tool_calls": [],
                "error": str(e)
            }


# Lazy singleton instance
_chatbot_agent = None


def get_chatbot_agent():
    """Get the singleton chatbot agent instance."""
    global _chatbot_agent
    if _chatbot_agent is None:
        try:
            _chatbot_agent = ChatBotAgent()
        except Exception as e:
            print(f"Error initializing chatbot agent: {str(e)}")
            # Create a mock agent that returns error messages
            class MockChatBotAgent:
                def __init__(self, error_msg: str):
                    self.mock_mode = True
                    self.error_msg = error_msg

                async def process_message(self, user_id: str, message: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
                    return {
                        "response": f"Chatbot initialization error: {self.error_msg}. Please check your OPENROUTER_API_KEY configuration.",
                        "tool_calls": [],
                        "error": self.error_msg
                    }

            _chatbot_agent = MockChatBotAgent(str(e))

    return _chatbot_agent