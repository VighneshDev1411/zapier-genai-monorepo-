from celery import shared_task
from app.core.flow_executor import execute_flow_with_langchain
@shared_task
def run_scheduled_flow(flow_id: str): 
    execute_flow_with_langchain(flow_id)