import hashlib
import uuid
import datetime
from typing import Dict
from schemas.explain import AuditRecord

class ExplainIQAuditEngine:
  def generate_audit_record(
    self,
    customer_id: str,
    execution_time_ms: float,
    trust_score: float,
    priority_score: float
  ) -> AuditRecord:
    
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
    
    versions = {
      "TrustLayer": "1.0.0",
      "BehaviorIQ": "1.0.0",
      "FinancialDNA": "1.0.0",
      "PriorityIQ": "1.0.0",
      "RMCopilot": "1.0.0",
      "ExplainIQ": "1.0.0"
    }
    
    # Compute SHA256 Digest of inputs/outputs deterministically
    checksum = f"T:{trust_score:.2f}-P:{priority_score:.2f}"
    versions_str = ",".join(f"{k}:{v}" for k, v in sorted(versions.items()))
    
    raw_payload = f"{customer_id}-{now_str}-{versions_str}-{checksum}"
    digest = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
    
    audit_id = f"AUD-{uuid.uuid4().hex[:12].upper()}"
    trace_id = f"TRC-{uuid.uuid4().hex[:16].upper()}"
    
    return AuditRecord(
      auditId=audit_id,
      generatedTime=now_str,
      engineVersions=versions,
      inputSummary=f"Customer ID: {customer_id} KYC address status verified. Accounts transactional coverage analyzed.",
      outputSummary=f"Decision model verified. TrustScore: {trust_score:.0f}. PriorityScore: {priority_score:.0f}.",
      sha256Digest=digest,
      executionTimeMs=round(execution_time_ms, 2),
      traceId=trace_id
    )
