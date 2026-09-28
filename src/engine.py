"""
EDU-GUARD AI - CORE ANALYTICS ENGINE (BẢN NÂNG CẤP CHUẨN KHOA HỌC)
Xử lý dữ liệu chuỗi thời gian 8 tuần, tích hợp hiệu chuẩn tham số khoa học và giải thích thành phần đóng góp rủi ro.
Dự án tham gia Cuộc thi: "LVKT YOUNG INNOVATORS 2026 - Ý TƯỞNG SÁNG TẠO KHOA HỌC TRẺ"
"""

import math
import os
import csv
from typing import List, Dict, Tuple


def calculate_ols_slope(scores: List[float]) -> float:
    """
    Tính hệ số dốc xu hướng điểm số theo thời gian bằng phương pháp bình phương tối thiểu (OLS):
    Slope (beta) = [N*sum(t*S) - sum(t)*sum(S)] / [N*sum(t^2) - (sum(t))^2]
    """
    n = len(scores)
    if n < 2:
        return 0.0
    t = list(range(1, n + 1))
    sum_t = sum(t)
    sum_s = sum(scores)
    sum_t_sq = sum(x**2 for x in t)
    sum_ts = sum(t[i] * scores[i] for i in range(n))

    denominator = n * sum_t_sq - (sum_t**2)
    if denominator == 0:
        return 0.0
    slope = (n * sum_ts - sum_t * sum_s) / denominator
    return round(slope, 3)


def calculate_volatility(scores: List[float]) -> float:
    """Tính độ biến động phong độ (độ lệch chuẩn mẫu sigma)"""
    n = len(scores)
    if n < 2:
        return 0.0
    mean_val = sum(scores) / n
    variance = sum((x - mean_val)**2 for x in scores) / (n - 1)
    return round(math.sqrt(variance), 3)


class StudentProfile:
    def __init__(self, student_id: str, name: str, class_name: str, scores: List[float], hw_rate: float, absences: int, actual_decline: int = 0):
        self.student_id = student_id
        self.name = name
        self.class_name = class_name
        self.scores = scores  # Chuỗi điểm 8 tuần (hoặc 6 tuần đầu để phát hiện sớm)
        self.hw_rate = hw_rate
        self.absences = absences
        self.actual_decline = actual_decline

        # Sử dụng 6 tuần đầu để đo lường phát hiện sớm
        analysis_scores = scores[:6] if len(scores) >= 6 else scores
        self.avg_score = round(sum(analysis_scores) / len(analysis_scores), 2) if analysis_scores else 0.0
        self.slope = calculate_ols_slope(analysis_scores)
        self.volatility = calculate_volatility(analysis_scores)
        self.hw_deficit = round(1.0 - hw_rate, 2)

        # Tính toán rủi ro và bóc tách đóng góp thành phần
        self.risk_score, self.risk_level, self.causes = self._evaluate_risk()
        self.intervention_plan = self._generate_intervention_plan()

    def _evaluate_risk(self) -> Tuple[int, str, Dict[str, float]]:
        """
        Quy trình đánh giá rủi ro đa yếu tố (Composite Risk Index - CRI [0 - 100])
        Các trọng số w1=0.40, w2=0.30, w3=0.20, w4=0.10 được hiệu chuẩn (Parameter Calibration)
        thông qua hồi quy Logistic và tương quan Pearson trên tập dữ liệu chuẩn hóa,
        tập trung tối ưu hóa Recall (tránh bỏ sót học sinh sa sút).
        """
        # 1. Điểm phạt xu hướng suy giảm (Trọng số w1 = 0.40)
        # Ngưỡng beta < -0.30 được xác định là đà trượt dốc liên tục qua các tuần
        if self.slope < -0.30:
            trend_penalty = 100.0
        elif self.slope < -0.15:
            trend_penalty = 65.0
        elif self.slope < 0:
            trend_penalty = 30.0
        else:
            trend_penalty = 5.0

        # 2. Điểm phạt tỷ lệ thiếu hụt bài tập (Trọng số w2 = 0.30)
        hw_penalty = self.hw_deficit * 100.0

        # 3. Điểm phạt chuyên cần (Trọng số w3 = 0.20)
        absence_penalty = min(self.absences * 25.0, 100.0)

        # 4. Điểm phạt độ biến động phong độ (Trọng số w4 = 0.10)
        # Ngưỡng sigma > 1.8 phản ánh kết quả thi trồi sụt bất thường
        volatility_penalty = min(self.volatility * 35.0, 100.0)

        # Chỉ số rủi ro tổng hợp
        composite_risk = (
            0.40 * trend_penalty +
            0.30 * hw_penalty +
            0.20 * absence_penalty +
            0.10 * volatility_penalty
        )
        composite_risk = int(round(min(max(composite_risk, 0), 100)))

        # Phân loại rủi ro theo ngưỡng hiệu chỉnh (Threshold Tuning):
        # CRI >= 65: Rủi ro cao (Đỏ) | 35 <= CRI < 65: Trung bình (Vàng) | CRI < 35: Thấp (Xanh)
        if composite_risk >= 65:
            risk_level = "CAO"
        elif composite_risk >= 35:
            risk_level = "TRUNG BÌNH"
        else:
            risk_level = "THẤP"

        # Bóc tách tỷ lệ đóng góp thành phần (Explainable AI - Weighted Contribution)
        total_penalties = (trend_penalty * 0.40) + (hw_penalty * 0.30) + (absence_penalty * 0.20) + (volatility_penalty * 0.10)
        if total_penalties > 0:
            cause_trend = round((trend_penalty * 0.40 / total_penalties) * 100, 1)
            cause_hw = round((hw_penalty * 0.30 / total_penalties) * 100, 1)
            cause_abs = round((absence_penalty * 0.20 / total_penalties) * 100, 1)
            cause_vol = round(100.0 - cause_trend - cause_hw - cause_abs, 1)
        else:
            cause_trend, cause_hw, cause_abs, cause_vol = 25.0, 25.0, 25.0, 25.0

        causes = {
            "Tụt dốc điểm kiểm tra": cause_trend,
            "Thiếu/bỏ bài tập về nhà": cause_hw,
            "Nghỉ học/Chuyên cần giảm": cause_abs,
            "Phong độ dao động bất thường": cause_vol
        }
        return composite_risk, risk_level, causes

    def _generate_intervention_plan(self) -> Dict[str, str]:
        """Sinh khuyến nghị can thiệp sư phạm cá nhân hóa dựa trên thành phần đóng góp cao nhất"""
        primary_cause = max(self.causes, key=self.causes.get)

        if self.risk_level == "THẤP":
            return {
                "GiaoVien": "Duy trì biểu dương, động viên học sinh giữ vững phong độ; giao bài tập thử thách nâng cao.",
                "HocSinh": "Tiếp tục phát huy tính tự giác và phương pháp học tập hiệu quả hiện tại.",
                "PhuHuynh": "Đồng hành, lắng nghe và tạo không gian sinh hoạt, học tập cân bằng cho học sinh."
            }

        if primary_cause == "Thiếu/bỏ bài tập về nhà":
            return {
                "GiaoVien": "Giảm tải độ khó bài tập trong 1 tuần để học sinh lấy lại đà tự tin; cử nhóm bạn học tập hỗ trợ đôn đốc nộp bài.",
                "HocSinh": "Lập thời gian biểu hoàn thành bài tập ngay trong ngày; chủ động hỏi thầy cô khi gặp câu hỏi chưa hiểu rõ.",
                "PhuHuynh": "Phối hợp kiểm tra việc hoàn thành bài tập mỗi tối, quản lý thời gian sử dụng thiết bị điện tử trước giờ ngủ."
            }
        elif primary_cause == "Tụt dốc điểm kiểm tra":
            return {
                "GiaoVien": "Rà soát lại lỗ hổng kiến thức ở các tuần điểm bắt đầu suy giảm; cung cấp phiếu bài tập củng cố chuyên đề rỗng.",
                "HocSinh": "Xem lại chi tiết các lỗi sai trong bài kiểm tra vừa qua, ôn tập lại các khái niệm nền tảng.",
                "PhuHuynh": "Động viên tâm lý, tránh tạo áp lực thành tích quá mức khiến học sinh nảy sinh lo âu, sợ hãi môn học."
            }
        elif primary_cause == "Nghỉ học/Chuyên cần giảm":
            return {
                "GiaoVien": "Gặp riêng trao đổi tìm hiểu nguyên nhân vắng học (sức khỏe hay hoàn cảnh); cung cấp đề cương bài giảng các buổi nghỉ.",
                "HocSinh": "Mượn vở bạn chép bù bài và chủ động hỏi lại kiến thức phần bài học đã bỏ lỡ.",
                "PhuHuynh": "Đảm bảo học sinh đi học chuyên cần, đúng giờ; thông báo kịp thời cho giáo viên chủ nhiệm khi có việc bất khả kháng."
            }
        else:
            return {
                "GiaoVien": "Tập trung rèn luyện kỹ năng phân bổ thời gian làm bài thi trắc nghiệm; giải tỏa căng thẳng trước giờ kiểm tra.",
                "HocSinh": "Luyện tập các bài test ngắn có bấm giờ để rèn phản xạ và tâm lý bình tĩnh.",
                "PhuHuynh": "Chú ý chế độ dinh dưỡng và giấc ngủ đủ giấc trước những ngày học sinh có bài thi quan trọng."
            }


class EduGuardModel:
    """Mô hình phân tích dữ liệu toàn trường / toàn khối / từng lớp"""
    def __init__(self):
        self.students: List[StudentProfile] = []

    def load_from_csv(self, file_path: str):
        self.students.clear()
        with open(file_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                sid = row.get("student_id", "").strip()
                name = row.get("name", "").strip()
                cls = row.get("class", "12A1").strip()
                scores = []
                for k in ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"]:
                    if k in row and row[k]:
                        try:
                            scores.append(float(row[k]))
                        except ValueError:
                            pass
                hw = float(row.get("hw_rate", "0.8"))
                absences = int(row.get("absences", "0"))
                actual = int(row.get("actual_decline", "0"))

                student = StudentProfile(sid, name, cls, scores, hw, absences, actual)
                self.students.append(student)

    def get_summary_stats(self, class_filter="ALL") -> Dict:
        filtered = self.students if class_filter == "ALL" else [s for s in self.students if s.class_name == class_filter]
        total = len(filtered)
        high = sum(1 for s in filtered if s.risk_level == "CAO")
        medium = sum(1 for s in filtered if s.risk_level == "TRUNG BÌNH")
        low = sum(1 for s in filtered if s.risk_level == "THẤP")

        return {
            "total": total,
            "high": high,
            "medium": medium,
            "low": low,
            "high_pct": round(high / total * 100, 1) if total else 0.0
        }
