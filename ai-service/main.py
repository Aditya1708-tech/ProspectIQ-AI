from fastapi import FastAPI, HTTPException, status
from contracts import AIAnalysisRequest, AIAnalysisResponse
from engines.trustlayer.engine import DataQualityEngine
from engines.findna.engine import FinancialDNAEngine
from engines.priorityiq.engine import LeadQualityEngine
from engines.copilot.engine import RecommendationEngine
from engines.explainiq.engine import ExplainabilityEngine

app = FastAPI(
    title="ProspectIQ AI - Inference Service",
    description="Explainable Behavioral Credit Intelligence Platform backend engines",
    version="1.0.0"
)

# Initialize engines
dq_engine = DataQualityEngine()
fdna_engine = FinancialDNAEngine()
lq_engine = LeadQualityEngine()
rec_engine = RecommendationEngine()
exp_engine = ExplainabilityEngine()

@app.get("/health", status_code=status.HTTP_200_OK)
def health():
    return {"status": "healthy"}

@app.post("/analyze", response_model=AIAnalysisResponse, status_code=status.HTTP_200_OK)
def analyze(request: AIAnalysisRequest):
    try:
        # Step 1: Signal Integrity & Data Quality validation
        completeness, dq_confidence, presence = dq_engine.analyze(
            request.traditionalSummary, 
            request.alternativeSummary
        )
        
        # Step 2: Financial DNA Profile Synthesis
        fdna_profile = fdna_engine.generate(
            request.customerId,
            request.segment,
            request.traditionalSummary,
            request.alternativeSummary,
            dq_confidence
        )
        
        # Step 3: Lead Priority Scoring
        priority_score = lq_engine.score(fdna_profile)
        
        # Step 4: Rule-based Qualitative Recommendation translation
        readiness_indicator = rec_engine.generate(priority_score, fdna_profile)
        
        # Step 5: Grounded Explanation Object Compilation
        explanation_obj = exp_engine.explain(fdna_profile, priority_score, readiness_indicator)
        
        # Business Rule 10: Flag and reject recommendations with incomplete explanation coverage
        if explanation_obj is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Incomplete explanation: Every priority recommendation must have verified grounded evidence."
            )
            
        return AIAnalysisResponse(
            customerId=request.customerId,
            fdnaProfile=fdna_profile,
            priorityScore=priority_score,
            explanation=explanation_obj,
            readinessIndicator=readiness_indicator
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference Engine failure: {str(e)}"
        )
