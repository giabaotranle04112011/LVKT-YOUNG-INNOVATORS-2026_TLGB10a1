"""
Script trích xuất toàn bộ dữ liệu 120 học sinh thành tệp data.js cho Bản Web Nâng Cao.
"""

import json
import os
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Thêm thư mục src vào sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "src"))
from engine import EduGuardModel

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)
CSV_PATH = os.path.join(BASE_DIR, "src", "dataset_120_students.csv")
WEB_DIR = os.path.join(BASE_DIR, "web")
os.makedirs(WEB_DIR, exist_ok=True)
JS_PATH = os.path.join(WEB_DIR, "data.js")

model = EduGuardModel()
model.load_from_csv(CSV_PATH)

web_data = []
for s in model.students:
    web_data.append({
        "student_id": s.student_id,
        "name": s.name,
        "class_name": s.class_name,
        "scores": s.scores,
        "avg_score": s.avg_score,
        "slope": s.slope,
        "volatility": s.volatility,
        "hw_rate": s.hw_rate,
        "absences": s.absences,
        "risk_score": s.risk_score,
        "risk_level": s.risk_level,
        "causes": s.causes,
        "intervention_plan": s.intervention_plan,
        "actual_decline": s.actual_decline
    })

js_content = f"// EDU-GUARD AI v1.0 - DATASET 120 HỌC SINH (8 TUẦN)\nconst STUDENTS_DATA = {json.dumps(web_data, ensure_ascii=False, indent=2)};\n"

with open(JS_PATH, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Đã xuất thành công {len(web_data)} học sinh ra tệp Web: {JS_PATH}")
