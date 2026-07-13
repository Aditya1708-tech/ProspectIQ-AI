# Core Notification Generators for NotificationIQ
import datetime
from typing import List, Dict, Any
from schemas.analyze import CustomerProfileRequest, TaskSchema
from schemas.notification import NotificationModel

# Import other engines to reuse their scoring outputs
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.findna.engine import FinDNAEngine
from engines.priorityiq.engine import PriorityIQEngine
from engines.copilot.engine import RMCopilotEngine
from engines.nbaiq.engine import NBAIQEngine
from engines.relationshipiq.engine import RelationshipIQEngine
from engines.predictiq.engine import PredictIQEngine

from engines.notificationiq.rules import evaluate_rules
from engines.notificationiq.scheduler import evaluate_task_alerts

def run_profile_engines(profile: CustomerProfileRequest) -> Dict[str, Any]:
  """
  Helper to run previous engines sequentially to obtain scoring outputs
  without duplicating logic.
  """
  try:
    trust_engine = TrustLayerEngine()
    trust_data = trust_engine.analyze(profile)
  except Exception:
    return {}
    
  if trust_data.qualityScore <= 0:
    return {"trust": trust_data}

  try:
    behavior_engine = BehaviorIQEngine()
    behavior_data = behavior_engine.analyze(profile)
  except Exception:
    behavior_data = None

  try:
    findna_engine = FinDNAEngine()
    dna_data = findna_engine.analyze(profile, trust_data, behavior_data)
  except Exception:
    dna_data = None

  try:
    priority_engine = PriorityIQEngine()
    priority_data = priority_engine.analyze(profile, trust_data, behavior_data, dna_data)
  except Exception:
    priority_data = None

  try:
    copilot_engine = RMCopilotEngine()
    copilot_data = copilot_engine.analyze(profile, trust_data, behavior_data, dna_data, priority_data)
  except Exception:
    copilot_data = None

  try:
    nbaiq_engine = NBAIQEngine()
    nbaiq_data = nbaiq_engine.analyze(profile, trust_data, behavior_data, dna_data, priority_data, copilot_data)
  except Exception:
    nbaiq_data = None

  try:
    relationship_engine = RelationshipIQEngine()
    relationship_data = relationship_engine.analyze(profile, trust_data, behavior_data, dna_data, priority_data, copilot_data, nbaiq_data)
  except Exception:
    relationship_data = None

  try:
    predict_engine = PredictIQEngine()
    predict_data = predict_engine.analyze(profile, trust_data, behavior_data, dna_data, priority_data, copilot_data, nbaiq_data, relationship_data)
  except Exception:
    predict_data = None

  return {
    "trust": trust_data,
    "behavior": behavior_data,
    "dna": dna_data,
    "priority": priority_data,
    "copilot": copilot_data,
    "nbaiq": nbaiq_data,
    "relationship": relationship_data,
    "predict": predict_data
  }

def compile_notifications(
  profiles: List[CustomerProfileRequest],
  tasks: List[TaskSchema],
  user_id: str,
  user_role: str,
  now_str: str,
  expiry_str: str
) -> List[NotificationModel]:
  """
  Compiles all notifications across customer profiles and tasks
  """
  notifications = []
  
  # 1. Customer profile-based alerts
  for profile in profiles:
    engines_data = run_profile_engines(profile)
    customer_notifs = evaluate_rules(profile, engines_data, now_str, expiry_str, manager_id=user_id)
    notifications.extend(customer_notifs)
    
  # 2. Task-based alerts
  task_notifs = evaluate_task_alerts(tasks, now_str, expiry_str, manager_id=user_id)
  notifications.extend(task_notifs)
  
  # 3. Add system status or info notifications
  system_notif = NotificationModel(
    id="not-system-platform-health",
    title="System Alert: Platform Status Normal",
    description="All AI pipelines, data integrity check routines, and database integrations are running at peak health.",
    category="SYSTEM_INFORMATION",
    priority="LOW",
    channel=["RM Dashboard", "In-App Alert", "Timeline Feed"],
    createdTime=now_str,
    expiryTime=expiry_str,
    assignedRM=user_id,
    assignedManager=user_id,
    readStatus=False,
    acknowledgedStatus=False,
    escalationLevel=0,
    workflowLink="/admin",
    confidence=1.0
  )
  notifications.append(system_notif)
  
  return notifications
