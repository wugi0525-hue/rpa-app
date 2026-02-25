export const rpaCategories = {
    ko: [
        {
            id: 1, title: "고객 만족 지향", subtitle: "Customer Satisfaction", focus: "고객 중심 사고: 현장 작업자들이 최종 고객의 요구와 품질 피드백을 실시간으로 인지하고 있는가?",
            goodExamples: [{ title: "고객 데이터의 시각적 공유", detail: "현장 대시보드에 고객사 로고, 불만률(Claim Rate), 반품 현황 등 핵심 지표가 명확하게 게시되어 있습니다." }, { title: "투명한 정보 제공", detail: "공장 입구에 웰컴 보드가 비치되어 방문객과 전 직원에게 레이아웃 및 주요 생산 현황을 직관적으로 안내합니다." }],
            badExamples: [{ title: "지표의 사일로화(Silo)", detail: "고객 피드백이나 핵심 품질 데이터가 관리자 사무실에만 보관되어 현장 작업자에게 공유되지 않습니다." }],
            color: "#3b82f6"
        },
        {
            id: 2, title: "안전, 환경 및 정리정돈(5S)", subtitle: "Safety, Environment & Order", focus: "안전성 및 근무 환경: 통행로와 작업 공간이 안전하고 완벽하게 정돈되어 낭비가 없는가?",
            goodExamples: [{ title: "명확한 동선 분리 (구획화)", detail: "보행자 통로와 지게차 동선이 테이프로 명확히 구분되어 있으며, 자재가 선을 침범하지 않습니다." }, { title: "섀도 보드(Shadow Board) 운용", detail: "모든 공구의 위치가 실루엣으로 지정되어 있어, 사용 중이거나 분실된 공구를 1초 만에 파악할 수 있습니다." }],
            badExamples: [{ title: "정돈(Set in Order) 결여", detail: "작업자가 도구 및 자재를 찾기 위해 지속적으로 작업 위치를 이탈하거나 불필요한 동작 낭비가 발생합니다." }, { title: "안전 위해 요소 방치", detail: "설비 주변에 누유 흔적이 부적절하게 방치되어 있거나, 환기 및 채광 상태가 매우 열악합니다." }],
            color: "#10b981"
        },
        {
            id: 3, title: "시각적 관리 시스템", subtitle: "Visual Management", focus: "가시성 확보: 별도의 질문 없이 구조물과 게시물만으로 현장의 정상/비정상 통제가 즉각적으로 파악되는가?",
            goodExamples: [{ title: "안돈(Andon) 시스템 가동", detail: "경광등 및 시각 알람을 통해 공정의 병목 현상과 고장 여부가 직관적으로 전달됩니다." }, { title: "표준 작업 지시서 시각화", detail: "글로만 적힌 매뉴얼이 아닌, 올바른 사례와 불량 사례(NG)를 비교한 사진이 작업자 눈높이에 부착되어 있습니다." }],
            badExamples: [{ title: "폐쇄적인 문서 관리", detail: "최신 매뉴얼이 현장이 아닌 관리자 캐비닛에 있으며, 설비 조작 패널의 라벨이 심하게 훼손되어 읽을 수 없습니다." }],
            color: "#8b5cf6"
        },
        {
            id: 4, title: "동기화된 스케줄링", subtitle: "Scheduling System", focus: "생산 통제력: 설비 가동률을 높이겠다는 명목으로 현장 수요와 무관한 밀어내기(Push) 생산을 하지 않는가?",
            goodExamples: [{ title: "풀(Pull) 방식 및 간판(Kanban) 운용", detail: "후공정의 명확한 수요 신호(Signal)에 따라 필요한 시점에 필요한 수량만큼만 생산이 이루어집니다." }],
            badExamples: [{ title: "밀어내기식(Push) 과잉 생산", detail: "당장의 고객 주문이 없음에도 설비 휴지기(Downtime)를 피하려 불필요한 반제품을 대량 양산하고 있습니다." }, { title: "현장과 유리된 ERP 의존", detail: "예상치 못한 설비 고장이나 결품이 발생해도, 통합 유연성 없이 과거 주기에 의존한 시스템 스케줄만 강행합니다." }],
            color: "#f59e0b"
        },
        {
            id: 5, title: "공간 활용 및 물류 흐름", subtitle: "Material Flow & Workspace", focus: "흐름의 최적화: 자재(원자재/제공품)가 역률이나 우회 없이 최단 거리로 '단 한 번만' 운반되는가?",
            goodExamples: [{ title: "셀(Cell) 또는 U자형 라인 구축", detail: "공정이 제품 흐름 순서에 맞게 밀착 배치되어, 1개 흘리기(One-Piece Flow)가 효율적으로 작동합니다." }, { title: "라인 사이드(Line-side) 직접 공급", detail: "작업대 인접 거리에 소터/슈트가 있어 불필요한 보행이나 과도한 동작(Bending) 없이 부품을 수급합니다." }],
            badExamples: [{ title: "과도한 자재 취급(Material Handling) 낭비", detail: "라인 간 거리 이격으로 지게차나 카트에 대한 운반 의존도가 비정상적으로 높습니다." }, { title: "데드 스페이스(Dead Space) 방치", detail: "설비 사이에 잉여 공간이 많으며, 이 공간이 곧 불량 자재나 불용품의 적치장으로 변질되어 있습니다." }],
            color: "#f43f5e"
        },
        {
            id: 6, title: "재고 및 재공품(WIP) 수준", subtitle: "Inventory & WIP Levels", focus: "재고 통제: 각 공정 사이에 대기 중인 재공품(WIP)의 수량이 시스템 및 시각적으로 완벽히 통제되고 있는가?",
            goodExamples: [{ title: "명확한 버퍼(Buffer) 구역 시각화", detail: "물품 적재 구획이 선명하게 그려져 있으며, 해당 구획이 꽉 차면 선행 공정은 즉시 작업을 중단합니다." }, { title: "신속한 재고 회전 및 선입선출(FIFO)", detail: "자재 창고의 라벨링을 통해 선입선출이 엄격히 준수되고 재고 체류 기간이 아주 짧음을 증명합니다." }],
            badExamples: [{ title: "통제 불능의 바닥 적재", detail: "다음 공정 앞바닥이나 통로에 정체불명의 반제품이 산더미처럼 쌓인 채 비닐에 덮여 있습니다." }, { title: "악성 완제품 재고 누적", detail: "고객 확정 오더 없이 가동률만을 위해 생산되어 창고 한편에 먼지가 뽀얗게 쌓여있는 재고가 다수 발견됩니다." }],
            color: "#06b6d4"
        },
        {
            id: 7, title: "팀워크 및 직원 동기부여", subtitle: "Teamwork & Motivation", focus: "조직 문화: 현장 작업자들이 긍정적인 책임감을 가지고 문제 해결과 개선 활동에 능동적으로 참여하는가?",
            goodExamples: [{ title: "지속적 개선(Kaizen) 보드 활성화", detail: "현장 직원들이 주도적으로 제안한 개선(Before & After) 사례가 부착되어 있으며, 이에 대한 포상 시스템이 존재합니다." }, { title: "다기능공(Multi-skill) 훈련 현황 공유", detail: "결원 발생 시 유연한 대처가 가능하도록 직원들의 직무 교차 훈련 매트릭스가 투명하게 공개되어 있습니다." }],
            badExamples: [{ title: "수동적이고 경직된 현장 분위기", detail: "작업자들이 참관인의 눈을 피하며, 단순 오퍼레이팅 외의 라인 이슈가 발생해도 직접 소통하기보다는 관리자만 기다립니다." }, { title: "신분/계층적 분리 환경", detail: "사무직 관리자 전용 휴게실과 식당이 현장직과 명확히 차별화되어 조직 내 소속감을 저하시킵니다." }],
            color: "#ec4899"
        },
        {
            id: 8, title: "설비 유지보수(PM) 상태", subtitle: "Equipment Maintenance", focus: "설비 관리: 모든 생산 설비가 최상의 컨디션을 유지하며, 작업자 주도의 예방 정비 활동이 이뤄지는가?",
            goodExamples: [{ title: "TPM (종합 설비 보전) 일상 점검", detail: "각 설비마다 예방 점검표(Checklist)가 부착되어 있으며, 매일 작업자가 윤활 및 압력 게이지를 직접 확인한 내역이 명확합니다." }, { title: "정상 가동 범위의 시각적 통제", detail: "기계의 유리 계기판 등에 정상/주의 구역이 컬러 라벨로 표기되어 멀리서도 즉각 이상 유무 탐지가 가능합니다." }],
            badExamples: [{ title: "미봉책 위주의 사후 수리(Breakdown Maintenance)", detail: "설비가 멈출 때까지 가동하며, 스카치테이프나 케이블 타이 등을 이용한 임시방편(Band-Aid)형 수리 흔적이 다수 보입니다." }],
            color: "#64748b"
        },
        {
            id: 9, title: "복잡성 및 다품종 관리 능력", subtitle: "Complexity Management", focus: "유연성 대처: 다양한 수주 요건과 수시로 일어나는 모델 변경을 불량이나 심각한 병목현상 없이 처리하는가?",
            goodExamples: [{ title: "초고속 금형 교환(SMED) 적용", detail: "원터치 클램프, 마그네틱 지그, 사전 준비 카트(Cart) 등을 활용해 셋업(Setup)과 금형 교체가 10분 이내에 완료됩니다." }, { title: "포카요케(Poka-Yoke) 설계 기반 결함 방지", detail: "복잡한 부품 코드를 바코드로 스캔하여 오립을 차단하거나, 형합 구조물로 잘못된 조립 시도를 물리적으로 막아냅니다." }],
            badExamples: [{ title: "극심한 전환 손실(Changeover Loss)", detail: "모델 변경 시 작업자가 창고를 여러 번 다녀오고 설비 세팅에 1시간 이상 소비하여 생산성이 대폭 하락합니다." }, { title: "의존적 수기 관리의 한계", detail: "잦은 모델 변경 속에서 작업 지시서가 혼재되어 굴러다니며 공정 간 커뮤니케이션 에러가 지속 발생합니다." }],
            color: "#d946ef"
        },
        {
            id: 10, title: "공급망 통합 운영", subtitle: "Supply Chain Integration", focus: "파트너십: 우수 협력업체와의 물류 및 품질 데이터 교류가 유기적으로 통합되어 리드타임이 단축되는가?",
            goodExamples: [{ title: "Dock-to-Line (수입검사 면제 직행) 프로세스", detail: "우수 등급 협력업체의 자재는 별도의 품질 검수 지연 없이 라인 사이드로 즉각 조달(JIT) 됩니다." }, { title: "핵심 성과 대시보드(Dashboard) 공유", detail: "협력사의 납기 준수율(OTD) 및 품질 불량률 지표가 정기적으로 측정되며 상호 개선 목표가 투명하게 공유됩니다." }],
            badExamples: [{ title: "물류 하역장(Dock)의 구조적 적체", detail: "입고 물량 대비 수입 검사 인력이 부족하여 승인 대기 자재가 병목 구간으로 작용, 라인의 결품을 유발합니다." }, { title: "상하 관계의 매절 거래", detail: "납품 업체를 단가 절감의 도구로만 압박하며, 품질 부적합 발생 시 근본 원인 분석 없이 단순 반품/폐기 조치만 일삼습니다." }],
            color: "#14b8a6"
        },
        {
            id: 11, title: "품질 최우선 시스템", subtitle: "Commitment to Quality", focus: "품질 헌신도: 불량을 감추지 않고 즉시 드러내며, 근본 원인(Root Cause)을 추적해 다음 공정으로 하자를 넘기지 않는가?",
            goodExamples: [{ title: "공정 내 품질 확보(Built-in Quality)", detail: "다음 공정을 '엄격한 고객'으로 인식하여, 앞 공정으로부터 불량 자재가 유입되면 즉각 라인을 멈추고 거부할 수 있는 권한이 있습니다." }, { title: "데이터 기반의 5-Why 원인 분석", detail: "재발 방지를 위해 단순 재작업(Rework)에 그치지 않고 PDCA 혹은 8D 리포트를 통해 품질 이슈를 철저히 파헤칩니다." }],
            badExamples: [{ title: "숨겨진 재작업 구역(Hidden Rework Farm)", detail: "생산 라인 뒤편 후미진 곳이나 별도 구역에서 인력이 대량의 제품을 재조립, 재납땜하며 보이지 않는 원가 손실을 초래합니다." }, { title: "품질 리더십 상실", detail: "'지금 내가 만들고 있는 이 제품을, 내 돈을 주고 기꺼이 사겠는가?' 라는 본질적인 질문에 작업자의 자부심이 전혀 없습니다." }],
            color: "#ef4444"
        }
    ],
    en: [
        {
            id: 1, title: "Customer Satisfaction", subtitle: "Customer Focus", focus: "Customer Orientation: Are operators fully aware of who the final customer is and what the quality expectations are?",
            goodExamples: [{ title: "Visual Display of Customer Data", detail: "Customer logos, Claim Rates, and crucial quality metrics are visibly posted and shared on the shop floor dashboard." }, { title: "Transparent Factory Information", detail: "Welcome boards at the entrance and clear line layout charts intuitively guide visitors and workers alike." }],
            badExamples: [{ title: "Data Silos", detail: "Quality metrics and customer feedback reside solely on management PCs, keeping line operators entirely disconnected from customer expectations." }],
            color: "#3b82f6"
        },
        {
            id: 2, title: "Safety, Environment & 5S", subtitle: "Safety, Environment & Order", focus: "Operational Environment: Are pathways safe, bright, perfectly ordered, and free of waste?",
            goodExamples: [{ title: "Clear Aisle Demarcation", detail: "Pedestrian walkways and forklift routes are strictly separated by tape; zero materials cross the boundaries." }, { title: "Shadow Board Utilization", detail: "All tools have designated silhouetted places, ensuring missing tools are recognized within a single second." }],
            badExamples: [{ title: "Lack of 'Set in Order'", detail: "Operators frequently leave their stations or waste significant motion repeatedly searching for essential tools and materials." }, { title: "Ignored Hazards", detail: "Oil leaks near machinery are poorly neglected, or ventilation and lighting conditions are severely inadequate." }],
            color: "#10b981"
        },
        {
            id: 3, title: "Visual Management System", subtitle: "Visual Management", focus: "Visibility: Can the normal vs abnormal state of the plant be instantly grasped solely through visual cues?",
            goodExamples: [{ title: "Active Andon System", detail: "Light towers (Green/Yellow/Red) and alarms instantly communicate line bottlenecks and machine breakdowns." }, { title: "Visual Standard Work Procedures", detail: "Instead of dense text manuals, visual comparisons displaying 'Correct' and 'Defective (NG)' examples are posted at eye level." }],
            badExamples: [{ title: "Closed Document Handling", detail: "The latest manuals are tucked away in a manager's cabinet, and machine operation labels are so worn they are unreadable." }],
            color: "#8b5cf6"
        },
        {
            id: 4, title: "Synchronized Scheduling", subtitle: "Scheduling System", focus: "Production Control: Is production driven by actual downstream pull rather than pushing for maximum machine utilization?",
            goodExamples: [{ title: "Pull System and Kanban", detail: "Production only occurs precisely when triggered by a clear demand signal (Kanban) from the downstream process." }],
            badExamples: [{ title: "Push System Overproduction", detail: "To avoid machine downtime, the plant produces mountains of intermediate inventory despite a lack of actual customer orders." }, { title: "Blind Reliance on ERP", detail: "Even during equipment failures or part shortages, the plant stubbornly forces a rigid software-generated schedule, ignoring shop-floor realities." }],
            color: "#f59e0b"
        },
        {
            id: 5, title: "Space Utilization & Material Flow", subtitle: "Material Flow & Workspace", focus: "Flow Optimization: Do parts travel the shortest possible distance without backtracking, moving 'only once'?",
            goodExamples: [{ title: "Cellular or U-Shaped Layouts", detail: "Processes are spaced tightly according to process sequence, enabling highly efficient One-Piece Flow." }, { title: "Line-Side Supply", detail: "Materials are supplied directly to the operator's reach via chutes or sorters, eliminating excess walking and bending." }],
            badExamples: [{ title: "Excessive Material Handling Waste", detail: "Due to distant process spacing, there is an abnormally high reliance on forklifts and heavy carts." }, { title: "Dead Space Ignored", detail: "Excessive unused floor space between machines easily transforms into a dumping ground for scrap and obsolete items." }],
            color: "#f43f5e"
        },
        {
            id: 6, title: "Inventory & WIP Levels", subtitle: "Inventory & WIP Levels", focus: "Inventory Control: Is the volume of Work-In-Progress (WIP) waiting between processes perfectly visually and systematically controlled?",
            goodExamples: [{ title: "Clearly Visualized Buffer Zones", detail: "Designated inventory squares are clearly painted; once full, the upstream process immediately ceases production." }, { title: "Rapid Rotation & FIFO", detail: "Material warehousing indicates strict First-In, First-Out compliance, proving extremely short inventory dwell times." }],
            badExamples: [{ title: "Uncontrolled Floor Storage", detail: "Mountains of unscheduled WIP, covered in plastic, clutter walkways and spaces in front of the next process." }, { title: "Stagnant Finished Goods", detail: "The warehouses hold vast quantities of dusty, obsolete finished goods produced merely to keep the line running." }],
            color: "#06b6d4"
        },
        {
            id: 7, title: "Teamwork & Motivation", subtitle: "Teamwork & Motivation", focus: "Culture: Do floor workers show active participation and positive ownership toward problem-solving?",
            goodExamples: [{ title: "Active Kaizen Boards", detail: "Worker-driven 'Before & After' improvement ideas are proudly displayed, backed by a functioning reward system." }, { title: "Multi-Skill Training Matrix", detail: "A transparent skills matrix is displayed, allowing flexible cross-coverage when absentees occur." }],
            badExamples: [{ title: "Passive, Rigid Environment", detail: "Workers avoid eye contact and merely wait for supervisors instead of addressing minor line issues themselves." }, { title: "Hierarchical Segregation", detail: "Manager-only break rooms and distinct cafeterias create a stark tier system that diminishes floor morale." }],
            color: "#ec4899"
        },
        {
            id: 8, title: "Equipment Maintenance Status", subtitle: "Equipment Maintenance", focus: "Asset Care: Is equipment kept in pristine condition with well-established operator-led preventive maintenance?",
            goodExamples: [{ title: "Daily TPM Checklists", detail: "Every machine features an attached clipboard where operators themselves physically check and sign off on hydraulics, lube, and pressures daily." }, { title: "Visual Control of Operating Ranges", detail: "Gauges feature green/red tape marking safe operating ranges, allowing instant detection of abnormalities from afar." }],
            badExamples: [{ title: "Reactive Breakdown Maintenance", detail: "Machines are run to failure. There are numerous signs of 'Band-Aid' fixes like duct tape or zip ties holding critical elements together." }],
            color: "#64748b"
        },
        {
            id: 9, title: "Complexity Management", subtitle: "Complexity Management", focus: "Flexibility: Does the plant handle frequent changeovers and multiple product variants blazingly fast without defects?",
            goodExamples: [{ title: "SMED (Single-Minute Exchange of Dies)", detail: "Using one-touch clamps, magnetic jigs, and pre-staged carts, equipment changeovers are fully completed in under 10 minutes." }, { title: "Poka-Yoke Error Proofing", detail: "Complex assembly variations are error-proofed using barcode scanners or structural jigs that physically prevent incorrect assembly." }],
            badExamples: [{ title: "Severe Changeover Loss", detail: "Operators walk back and forth to tool cribs and spend over an hour painfully calibrating the machine for a run." }, { title: "Manual Paperwork Chaos", detail: "In a high-mix environment, paper routing sheets lay scattered, constantly causing communication errors and misbuilds." }],
            color: "#d946ef"
        },
        {
            id: 10, title: "Supply Chain Integration", subtitle: "Supply Chain Integration", focus: "Partnership: Is the flow of materials and quality data with top suppliers so integrated that it reduces overall lead times?",
            goodExamples: [{ title: "Dock-to-Line Process", detail: "Materials from certified suppliers bypass initial receiving inspection and are delivered Just-In-Time (JIT) directly to the point of use." }, { title: "Shared Performance Dashboards", detail: "Supplier On-Time Delivery (OTD) and Defect rates are regularly monitored, shared, and managed via joint improvement goals." }],
            badExamples: [{ title: "Structural Dock Congestion", detail: "Massive pile-ups of uninspected goods stagnate at the receiving dock due to a lack of inspectors, starving the assembly line of parts." }, { title: "Adversarial Purchasing", detail: "Suppliers are squeezed purely on price; defective batches are simply returned without any root-cause partnership." }],
            color: "#14b8a6"
        },
        {
            id: 11, title: "Commitment to Quality", subtitle: "Commitment to Quality", focus: "Quality Dedication: Are defects boldly exposed and immediately root-caused instead of being silently pushed down the line?",
            goodExamples: [{ title: "Built-in Quality", detail: "Operators treat the next process as the ultimate customer. They possess the authority to stop the line to reject defective incoming materials." }, { title: "Data-Driven Root Cause Analysis", detail: "Instead of simply reworking, quality teams deploy 5-Why analysis or 8D reports to establish permanent countermeasures." }],
            badExamples: [{ title: "Hidden Rework Farms", detail: "Behind the main line or in secluded corners, armies of workers manually refit and solder reject products, drastically increasing invisible costs." }, { title: "Loss of Quality Leadership", detail: "When asked, 'Would you buy the exact product you are assembling with your own money?', workers exhibit zero confidence." }],
            color: "#ef4444"
        }
    ],
    ja: [
        {
            id: 1, title: "顧客満足志向", subtitle: "Customer Satisfaction", focus: "顧客志向: 現場作業員は最終顧客の要求と品質フィードバックをリアルタイムで認識しているか？",
            goodExamples: [{ title: "顧客データの視覚的共有", detail: "現場のダッシュボードに顧客企業のロゴ、クレーム率、返品状況などの主要指標が明確に掲示されています。" }, { title: "透明な情報提供", detail: "工場入口にウェルカムボードが配置され、訪問者と全従業員にレイアウトや主要な生産状況を直感的に案内しています。" }],
            badExamples: [{ title: "指標のサイロ化", detail: "顧客フィードバックや主要な品質データが管理者のオフィスにのみ保管され、現場作業員には共有されていません。" }],
            color: "#3b82f6"
        },
        {
            id: 2, title: "安全、環境、および整理整頓(5S)", subtitle: "Safety, Environment & Order", focus: "安全性および作業環境: 通路や作業スペースが安全に、かつ完全に整頓され、無駄がないか？",
            goodExamples: [{ title: "明確な動線の分離（区画化）", detail: "歩行者通路とフォークリフトの動線がテープで明確に区別され、資材がラインを越えることはありません。" }, { title: "シャドーボードの運用", detail: "全工具の配置がシルエットで指定されており、使用中や紛失した工具を1秒で把握できます。" }],
            badExamples: [{ title: "整頓の欠如", detail: "作業員が道具や資材を探すために継続して作業位置を離れるか、不必要な動作の無駄が発生しています。" }, { title: "安全上の危険要素の放置", detail: "設備の周辺に油漏れの跡が不適切に放置されているか、換気および採光状態が非常に劣悪です。" }],
            color: "#10b981"
        },
        {
            id: 3, title: "視覚的管理システム", subtitle: "Visual Management", focus: "可視性の確保: 別途質問することなく、構造物や掲示物だけで現場の正常/異常の統制が即座に把握できるか？",
            goodExamples: [{ title: "アンドン(Andon)システム稼働", detail: "警告灯や視覚アラームを通じて工程のボトルネックや故障状況が直感的に伝達されます。" }, { title: "標準作業手順書の視覚化", detail: "文字だけのマニュアルではなく、正しい事例と不良事例(NG)を比較した写真が作業員の目の高さに貼られています。" }],
            badExamples: [{ title: "閉鎖的な文書管理", detail: "最新のマニュアルが現場ではなく管理者のキャビネットにあり、設備操作パネルのラベルが激しく損傷して読めません。" }],
            color: "#8b5cf6"
        },
        {
            id: 4, title: "同期化されたスケジューリング", subtitle: "Scheduling System", focus: "生産統制力: 設備稼働率を上げるという名目で、現場の需要に関係のない押し出し(Push)生産をしていないか？",
            goodExamples: [{ title: "プル(Pull)方式およびかんばん(Kanban)の運用", detail: "後工程の明確な需要シグナルに従い、必要な時に必要な数量だけ生産が行われます。" }],
            badExamples: [{ title: "押し出し式(Push)の過剰生産", detail: "当面の顧客注文がないにもかかわらず、設備の休止(Downtime)を避けるために不必要な半製品を大量に量産しています。" }, { title: "現場と乖離したERPへの依存", detail: "予期せぬ設備故障や欠品が発生しても、統合的な柔軟性なしに過去の周期に依存したシステムスケジュールのみを強行します。" }],
            color: "#f59e0b"
        },
        {
            id: 5, title: "スペース活用および物流フロー", subtitle: "Material Flow & Workspace", focus: "フローの最適化: 資材(原材料/仕掛品)が逆行や迂回なしに最短距離で「たった一度だけ」運搬されるか？",
            goodExamples: [{ title: "セル(Cell)またはU字型ラインの構築", detail: "工程が製品のフロー順序に合わせて密接に配置され、1個流し(One-Piece Flow)が効率的に作動します。" }, { title: "ラインサイド(Line-side)への直接供給", detail: "作業台のすぐ近くにソーター/シュートがあり、不必要な歩行や過度な動作(Bending)なしに部品を供給します。" }],
            badExamples: [{ title: "過度なマテリアルハンドリングの無駄", detail: "ライン間の距離が離れているため、フォークリフトやカートへの運搬依存度が異常に高いです。" }, { title: "デッドスペースの放置", detail: "設備の間に余剰スペースが多く、このスペースがそのまま不良資材や不要品の仮置き場と化しています。" }],
            color: "#f43f5e"
        },
        {
            id: 6, title: "在庫および仕掛品(WIP)レベル", subtitle: "Inventory & WIP Levels", focus: "在庫統制: 各工程間で待機中の仕掛品(WIP)の数量がシステム的および視覚的に完全に統制されているか？",
            goodExamples: [{ title: "明確なバッファ(Buffer)区画の視覚化", detail: "物品の積載区画が鮮明に描かれており、該当区画が満杯になれば先行工程は即座に作業を中断します。" }, { title: "迅速な在庫回転および先入先出(FIFO)", detail: "資材倉庫のラベリングを通じて先入先出が厳格に遵守され、在庫滞留期間が非常に短いことを証明しています。" }],
            badExamples: [{ title: "統制不能な床置き", detail: "次工程の前の床や通路に正体不明の半製品が山のように積まれたままビニールで覆われています。" }, { title: "悪性完成品在庫の蓄積", detail: "顧客の確定注文なしに稼働率のみのために生産され、倉庫の片隅にホコリを被って積まれている在庫が多数見受けられます。" }],
            color: "#06b6d4"
        },
        {
            id: 7, title: "チームワークおよび従業員のモチベーション", subtitle: "Teamwork & Motivation", focus: "組織文化: 現場作業員が肯定的な責任感を持って問題解決や改善活動に能動的に参加しているか？",
            goodExamples: [{ title: "継続的改善(Kaizen)ボードの活性化", detail: "現場従業員が主導的に提案した改善(Before & After)事例が掲示されており、これに対する報奨制度が存在します。" }, { title: "多能工(Multi-skill)訓練状況の共有", detail: "欠員発生時に柔軟な対処が可能になるよう、従業員の職務交替訓練マトリックスが透明に公開されています。" }],
            badExamples: [{ title: "受動的で硬直した現場の雰囲気", detail: "作業員が参観人の目を避け、単純なオペレーティング以外のラインの問題が発生しても直接コミュニケーションを取るよりは管理者だけを待ちます。" }, { title: "身分/階層的な分離環境", detail: "事務職管理者専用の休憩室や食堂が現場職と明確に差別化されており、組織内の帰属意識を低下させます。" }],
            color: "#ec4899"
        },
        {
            id: 8, title: "設備メンテナンス(PM)状態", subtitle: "Equipment Maintenance", focus: "設備管理: すべての生産設備が最上のコンディションを維持し、作業員主導の予防整備活動が行われているか？",
            goodExamples: [{ title: "TPM(全員参加の生産保全)の日常点検", detail: "各設備ごとに予防点検表(Checklist)が貼られており、毎日作業員が潤滑や圧力ゲージを直接確認した履歴が明確です。" }, { title: "正常稼働範囲の視覚的統制", detail: "機械のガラス計器盤などに正常/注意区域がカラーラベルで表記されており、遠くからでも即座に異常の有無を探知可能です。" }],
            badExamples: [{ title: "一時しのぎ中心の事後修理", detail: "設備が停止するまで稼働し、スコッチテープやケーブルタイ等を使った応急処置(Band-Aid)型の修理の跡が多数見られます。" }],
            color: "#64748b"
        },
        {
            id: 9, title: "複雑性および多品種管理能力", subtitle: "Complexity Management", focus: "柔軟性への対処: 多様な受注要件や随時発生するモデル変更を不良や深刻なボトルネックなしに処理しているか？",
            goodExamples: [{ title: "シングル段取り(SMED)の適用", detail: "ワンタッチクランプ、マグネット冶具、事前準備カート(Cart)等を活用し、段取り(Setup)と金型交換が10分以内に完了します。" }, { title: "ポカヨケ(Poka-Yoke)設計に基づく欠陥防止", detail: "複雑な部品コードをバーコードでスキャンして誤組み込みを遮断したり、型合わせ構造物で間違った組み立ての試みを物理的に防ぎます。" }],
            badExamples: [{ title: "深刻な段取りロス(Changeover Loss)", detail: "モデル変更時に作業員が倉庫を何度も往復し、設備セットアップに1時間以上消費して生産性が大幅に低下します。" }, { title: "依存的な手書き管理の限界", detail: "頻繁なモデル変更の中で作業指示書が混在して散乱し、工程間のコミュニケーションエラーが継続的に発生しています。" }],
            color: "#d946ef"
        },
        {
            id: 10, title: "サプライチェーン統合運営", subtitle: "Supply Chain Integration", focus: "パートナーシップ: 優秀な協力企業との物流および品質データの交流が有機的に統合され、リードタイムが短縮されているか？",
            goodExamples: [{ title: "Dock-to-Line（受入検査免除・直行）プロセス", detail: "優秀ランクの協力企業の資材は、別途の品質検収遅延なしに直ちにラインサイドへ調達(JIT)されます。" }, { title: "核心成果ダッシュボードの共有", detail: "協力企業の納期遵守率(OTD)および品質不良率指標が定期的に測定され、相互改善目標が透明に共有されています。" }],
            badExamples: [{ title: "物流荷下ろし場(Dock)の構造的滞留", detail: "入庫物量に対して受入検査の人員が不足しており、承認待ち資材がボトルネック区間として作用し、ラインの欠品を誘発します。" }, { title: "上下関係の買い切り取引", detail: "納入業者を単価削減のツールとしてのみ圧迫し、品質不適合が発生した際も根本原因の分析なしに単純な返品/廃棄措置だけを繰り返します。" }],
            color: "#14b8a6"
        },
        {
            id: 11, title: "品質最優先システム", subtitle: "Commitment to Quality", focus: "品質への献身度: 不良を隠さずに直ちに開示し、根本原因(Root Cause)を追跡して次の工程に不具合を引き渡していないか？",
            goodExamples: [{ title: "工程内での品質確保(Built-in Quality)", detail: "次の工程を「厳しい顧客」として認識し、前工程から不良資材が流入した場合は直ちにラインを停止し拒否する権限があります。" }, { title: "データに基づくなぜなぜ(5-Why)分析", detail: "再発防止のため単純な再作業(Rework)にとどまらず、PDCAや8Dレポートを通じて品質問題の根本を徹底的に掘り下げます。" }],
            badExamples: [{ title: "隠された再作業エリア(Hidden Rework Farm)", detail: "生産ラインの裏の奥まった場所や別の区域で、人員が大量の製品を再組み立て、再はんだ付けし、見えない原価損失をもたらしています。" }, { title: "品質リーダーシップの喪失", detail: "「今自分が作っているこの製品を、自分のお金を払って喜んで買うか？」という本質的な質問に対して、作業員の自負心が全くありません。" }],
            color: "#ef4444"
        }
    ],
    zh: [
        {
            id: 1, title: "以客户满意度为导向", subtitle: "Customer Satisfaction", focus: "客户导向：现场操作员是否实时了解最终客户的需求和质量反馈？",
            goodExamples: [{ title: "直观分享客户数据", detail: "在车间仪表板上清晰展示客户徽标、索赔率、退货状态等关键指标。" }, { title: "透明的信息展示", detail: "工厂入口处设有迎宾板，向访客和所有员工直观地介绍布局和主要生产状况。" }],
            badExamples: [{ title: "指标孤岛化", detail: "客户反馈和关键质量数据仅保存在管理人员办公室，未与现场操作员共享。" }],
            color: "#3b82f6"
        },
        {
            id: 2, title: "安全、环境与5S", subtitle: "Safety, Environment & Order", focus: "安全和工作环境：通道和操作空间是否安全、完全整洁且没有浪费？",
            goodExamples: [{ title: "明确区分动线", detail: "用胶带明确区分行人通道和叉车路线，材料绝对不会越过界线。" }, { title: "使用工具定位板 (Shadow Board)", detail: "所有工具的位置都以轮廓图指定，使用中或丢失的工具可在一秒钟内被发现。" }],
            badExamples: [{ title: "缺乏整理整顿", detail: "操作人员为了寻找工具和材料而不断离开工作岗位，产生大量不必要的动作浪费。" }, { title: "忽视安全隐患", detail: "设备周围的漏油痕迹未被处理，或者通风和照明条件极差。" }],
            color: "#10b981"
        },
        {
            id: 3, title: "可视化管理系统", subtitle: "Visual Management", focus: "确保可视性：是否无需提问，仅凭结构和标识就能立即掌握现场的正常/异常状态？",
            goodExamples: [{ title: "安灯(Andon)系统运行中", detail: "通过警示灯和视觉警报，直观地传达流程瓶颈和故障情况。" }, { title: "标准作业指导书的可视化", detail: "在操作人员视线齐平的地方，张贴着不仅有文字说明，还有正确示例和不良示例(NG)对比照片的指南。" }],
            badExamples: [{ title: "封闭式文档管理", detail: "最新的手册不在现场而是在管理人员的文件柜中，设备操作面板的标签严重磨损且无法阅读。" }],
            color: "#8b5cf6"
        },
        {
            id: 4, title: "同步化排程", subtitle: "Scheduling System", focus: "生产控制力：是否以提高设备利用率为名，进行与现场需求无关的推动式(Push)生产？",
            goodExamples: [{ title: "推行拉动式(Pull)及看板(Kanban)管理", detail: "根据后道工序发出的明确需求信号，仅在需要时生产所需数量的产品。" }],
            badExamples: [{ title: "推动式(Push)过度生产", detail: "即使目前没有客户订单，为了避免设备停机，仍在大量生产不必要的半成品。" }, { title: "过度依赖脱离现场的ERP系统", detail: "即使发生意外的设备故障或缺料，系统依然缺乏灵活性，强制执行基于过去周期的排程。" }],
            color: "#f59e0b"
        },
        {
            id: 5, title: "空间利用率与物流", subtitle: "Material Flow & Workspace", focus: "流程优化：物料（原材料/在制品）是否能够以最短距离被“且仅被搬运一次”，没有逆向流动或绕行？",
            goodExamples: [{ title: "构建单元化或U型生产线", detail: "工序按照产品流程顺序紧密排列，有效地实现了单件流(One-Piece Flow)。" }, { title: "线边(Line-side)直接供料", detail: "在靠近工作台的位置设有重力滑道或分类器，无需操作员多余的走动或过度弯腰即可获取零件。" }],
            badExamples: [{ title: "过度的物料搬运浪费", detail: "由于各工序间距离较远，对叉车或手推车运输的依赖度异常高。" }, { title: "存在死角(Dead Space)", detail: "设备之间存在大量多余空间，这些空间往往演变为不良物料或废弃物的堆放区。" }],
            color: "#f43f5e"
        },
        {
            id: 6, title: "库存及在制品(WIP)水平", subtitle: "Inventory & WIP Levels", focus: "库存控制：各工序之间等待的在制品数量是否在系统和视觉层面上得到完美控制？",
            goodExamples: [{ title: "明确的缓冲(Buffer)区域可视化", detail: "物品堆放区域的界线清晰，一旦该区域填满，前道工序应立即停止生产。" }, { title: "快速的库存周转与先进先出(FIFO)", detail: "通过原材料仓库的标签管理，严格遵守先进先出原则，并证明库存停滞时间极短。" }],
            badExamples: [{ title: "失控的地面堆放", detail: "在下道工序前的地面或通道上，堆积如山的未明半成品被塑料布覆盖着。" }, { title: "积压大量滞销成品库存", detail: "在没有客户确认订单的情况下，仅为维持运营率而生产，导致大量库存堆积在仓库角落积满灰尘。" }],
            color: "#06b6d4"
        },
        {
            id: 7, title: "团队合作与员工积极性", subtitle: "Teamwork & Motivation", focus: "组织文化：现场操作员是否积极且有责任感地参与问题解决和改进活动？",
            goodExamples: [{ title: "活跃的改善(Kaizen)看板", detail: "展示现场员工主动提出的改进（改善前/后）案例，并设有相应的奖励机制。" }, { title: "多技能(Multi-skill)培训情况共享", detail: "透明公开员工交叉培训矩阵，确保在出现缺勤时能够灵活应对。" }],
            badExamples: [{ title: "被动且僵化的现场氛围", detail: "操作人员逃避视线交流，一旦出现常规操作以外的产线问题，他们只会等待管理人员，而不愿直接沟通解决。" }, { title: "阶级化的隔离环境", detail: "办公室管理人员专用的休息室和食堂与一线员工的设施存在明显差别，降低了团队的归属感。" }],
            color: "#ec4899"
        },
        {
            id: 8, title: "设备维护(PM)状态", subtitle: "Equipment Maintenance", focus: "设备管理：所有生产设备是否均保持在最佳状态，并开展了由操作人员主导的预防性维护活动？",
            goodExamples: [{ title: "全面生产维护(TPM)日常检查", detail: "每台设备都附有预防性检查表(Checklist)，且有操作人员每天亲自检查润滑和压力表的清晰记录。" }, { title: "正常运行范围的可视化控制", detail: "在机器的玻璃仪表板上等，使用彩色标签清晰标出正常和注意区域，即使在远处也能立即察觉异常。" }],
            badExamples: [{ title: "以权宜之计为主的事后维修", detail: "设备一直运行到发生故障为止，随处可见使用胶带或扎带进行的临时性(Band-Aid)修理痕迹。" }],
            color: "#64748b"
        },
        {
            id: 9, title: "复杂性及多品种管理能力", subtitle: "Complexity Management", focus: "灵活应对：是否能在没有缺陷或严重瓶颈的情况下，快速处理各种订单需求和频繁的型号变更？",
            goodExamples: [{ title: "应用快速换模(SMED)", detail: "利用一键式夹具、磁性夹具、准备推车等，在10分钟以内完成设置(Setup)和模具更换。" }, { title: "基于防错(Poka-Yoke)设计的缺陷预防", detail: "通过使用条形码扫描复杂的零件代码来防止错装，或利用匹配结构物理地阻断错误组装的尝试。" }],
            badExamples: [{ title: "严重的换线损失(Changeover Loss)", detail: "在更换型号时，操作人员需多次往返仓库，并耗费1小时以上进行设备调试，导致生产率大幅下降。" }, { title: "手工管理的局限性", detail: "在频繁更换型号的过程中，混杂散落的作业指导书不断导致工序间的沟通错误。" }],
            color: "#d946ef"
        },
        {
            id: 10, title: "供应链整合运营", subtitle: "Supply Chain Integration", focus: "合作伙伴关系：是否与优秀供应商建立了物流和质量数据的有机融合，从而缩短了交货周期？",
            goodExamples: [{ title: "免检直达(Dock-to-Line)流程", detail: "来自优秀评级供应商的物料，能够免除质量检验带来的延迟，以准时制(JIT)直接送达线边。" }, { title: "核心绩效仪表板的共享", detail: "定期测量供应商的按时交货率(OTD)和不良率指标，并透明地分享双方的共同改进目标。" }],
            badExamples: [{ title: "由于结构限制导致的码头拥堵", detail: "相对于入库量，进料检验人员短缺，导致等待审批的物料成为瓶颈，引发生产线的缺料问题。" }, { title: "上下级关系的买断式交易", detail: "仅将供应商作为压低单价的工具，在发生质量不合格时，不进行根本原因分析，只采取简单的退货或报废处理。" }],
            color: "#14b8a6"
        },
        {
            id: 11, title: "质量第一体系", subtitle: "Commitment to Quality", focus: "质量承诺：是否直面而不掩盖缺陷，追溯根本原因(Root Cause)，并确保不合格品不流入下一道工序？",
            goodExamples: [{ title: "内建质量(Built-in Quality)", detail: "将下道工序视作“严苛的客户”，当上道工序流入不良物料时，操作人员有权立即停线并拒收。" }, { title: "基于数据的5-Why分析法", detail: "为了防止问题重复发生，不仅限于简单的返工(Rework)，而是通过戴明环(PDCA)或8D报告彻底剖析质量问题的根本原因。" }],
            badExamples: [{ title: "隐藏的返工区(Hidden Rework Farm)", detail: "在生产线的后方或隐蔽区域，大量人员以手工方式对拒绝产品进行重新组装或焊接，从而带来了巨大的隐形成本。" }, { title: "质量领导力的缺失", detail: "当被问及“你愿意花自己的钱，买你正在组装的这种产品吗？”时，员工没有表现出分毫的自信。" }],
            color: "#ef4444"
        }
    ],
    th: [
        {
            id: 1, title: "ความพึงพอใจของลูกค้า", subtitle: "Customer Satisfaction", focus: "การมุ่งเน้นลูกค้า: พนักงานระดับปฏิบัติการตระหนักถึงความต้องการและข้อเสนอแนะด้านคุณภาพของลูกค้าปลายทางแบบเรียลไทม์หรือไม่?",
            goodExamples: [{ title: "การแบ่งปันข้อมูลลูกค้าแบบภาพ", detail: "โลโก้บริษัทลูกค้า อัตราการเคลม สถานะการส่งคืน และตัวชี้วัดสำคัญอื่นๆ ถูกแสดงอย่างชัดเจนบนแดชบอร์ดในพื้นที่ปฏิบัติงาน" }, { title: "การให้ข้อมูลที่โปร่งใส", detail: "มีป้ายต้อนรับที่ทางเข้าโรงงาน ซึ่งแนะนำผู้เยี่ยมชมและพนักงานทุกคนให้เข้าใจแผนผังและสถานะการผลิตหลักอย่างเป็นธรรมชาติ" }],
            badExamples: [{ title: "ดัชนีชี้วัดที่ถูกแยกตัว (Silo)", detail: "ข้อเสนอแนะจากลูกค้าหรือข้อมูลคุณภาพที่สำคัญถูกเก็บไว้ในสำนักงานของผู้บริหารเท่านั้น และไม่ได้แบ่งปันให้กับพนักงานระดับปฏิบัติการ" }],
            color: "#3b82f6"
        },
        {
            id: 2, title: "ความปลอดภัย สิ่งแวดล้อม และ 5ส", subtitle: "Safety, Environment & Order", focus: "สภาพแวดล้อมการทำงานและความปลอดภัย: ทางเดินและพื้นที่ปฏิบัติงานมีความปลอดภัย เป็นระเบียบเรียบร้อย และไม่มีความสูญเปล่าหรือไม่?",
            goodExamples: [{ title: "การแยกเส้นทางสัญจรที่ชัดเจน", detail: "ทางเดินสำหรับพนักงานและเส้นทางรถยกถูกแยกออกจากกันอย่างชัดเจนด้วยเทป และไม่มีวัสดุล้ำเส้น" }, { title: "การใช้กระดานเงา (Shadow Board)", detail: "เครื่องมือทุกชิ้นมีตำแหน่งที่กำหนดด้วยรูปเงา ทำให้สามารถตรวจสอบเครื่องมือที่กำลังใช้งานหรือสูญหายได้ภายในหนึ่งวินาที" }],
            badExamples: [{ title: "ขาดการจัดระเบียบ", detail: "พนักงานระดับปฏิบัติการมักจะออกจากพื้นที่ทำงานเพื่อค้นหาเครื่องมือหรือวัสดุ หรือเกิดความสูญเปล่าจากการเคลื่อนไหวที่ไม่จำเป็นประจำเป็นจำนวนมาก" }, { title: "การละเว้นอันตรายด้านความปลอดภัย", detail: "ร่องรอยน้ำมันรั่วรอบเครื่องจักรถูกปล่อยปละละเลยอย่างไม่เหมาะสม หรือสภาพการระบายอากาศและแสงสว่างแย่มาก" }],
            color: "#10b981"
        },
        {
            id: 3, title: "ระบบการจัดการด้วยการมองเห็น", subtitle: "Visual Management", focus: "การสร้างการรับรู้ด้วยภาพ: สามารถเข้าใจสถานะปกติ/ผิดปกติของโรงงานได้ในทันทีจากโครงสร้างและป้ายประกาศโดยไม่ต้องสอบถามหรือไม่?",
            goodExamples: [{ title: "ระบบอันดง (Andon) ทำงานอยู่", detail: "ปัญหาคอขวดและสถานะความล้มเหลวของกระบวนการจะถูกสื่อสารอย่างเป็นธรรมชาติผ่านไฟเตือนและสัญญาณเตือนแบบภาพ" }, { title: "การสร้างภาพคู่มือการปฏิบัติงานมาตรฐาน", detail: "มีการติดภาพเปรียบเทียบระหว่างตัวอย่างที่ถูกต้องและตัวอย่างที่มีข้อบกพร่อง (NG) ในระดับสายตาของพนักงานระดับปฏิบัติการ แทนที่จะเป็นคู่มือที่มีแต่ข้อความ" }],
            badExamples: [{ title: "การจัดการเอกสารแบบปิด", detail: "คู่มือฉบับล่าสุดอยู่ในตู้เอกสารของผู้บริหาร ไม่ใช่ในพื้นที่ปฏิบัติงาน และฉลากแผงควบคุมอุปกรณ์ชำรุดมากจนไม่สามารถอ่านได้" }],
            color: "#8b5cf6"
        },
        {
            id: 4, title: "การกำหนดเวลาแบบซิงโครไนซ์", subtitle: "Scheduling System", focus: "การควบคุมการผลิต: มีการผลิตแบบผลัก (Push) โดยไม่สนใจความต้องการในพื้นที่ปฏิบัติงาน เพื่ออ้างว่าเป็นการเพิ่มอัตราการใช้อุปกรณ์หรือไม่?",
            goodExamples: [{ title: "การใช้ระบบดึง (Pull) และคัมบัง (Kanban)", detail: "การผลิตจะเกิดขึ้นเฉพาะในเวลาที่จำเป็นและในปริมาณที่ต้องการ ตามสัญญาณความต้องการที่ชัดเจนจากกระบวนการถัดไป" }],
            badExamples: [{ title: "การผลิตมากเกินไปในระบบผลัก (Push)", detail: "แม้ว่าขณะนี้จะไม่มีคำสั่งซื้อจากลูกค้า แต่ระบบยังคงผลิตสินค้ากึ่งสำเร็จรูปที่ไม่จำเป็นเป็นจำนวนมากเพื่อหลีกเลี่ยงเวลาหยุดเครื่อง (Downtime)" }, { title: "การพึ่งพาระบบ ERP ที่แยกออกจากหน้างาน", detail: "แม้จะเกิดเหตุการณ์ที่อุปกรณ์ล้มเหลวโดยไม่คาดคิดหรือขาดแคลนวัสดุ ระบบยังคงบังคับใช้ตารางเวลาตามรอบในอดีตอย่างเคร่งครัดโดยขาดความยืดหยุ่นในการบูรณาการ" }],
            color: "#f59e0b"
        },
        {
            id: 5, title: "การใช้พื้นที่และการไหลของวัสดุ", subtitle: "Material Flow & Workspace", focus: "การเพิ่มประสิทธิภาพการไหล: วัสดุ (วัตถุดิบ/สินค้าในกระบวนการ) ถูกขนส่งในระยะทางสั้นที่สุด 'เพียงครั้งเดียว' โดยไม่มีการย้อนกลับหรือเปลี่ยนเส้นทางหรือไม่?",
            goodExamples: [{ title: "การวางผังแบบเซลล์ (Cell) หรือรูปตัวยู (U-shape)", detail: "กระบวนการถูกจัดเรียงอย่างใกล้ชิดตามลำดับการไหลของผลิตภัณฑ์ ทำให้การไหลแบบชิ้นเดียว (One-Piece Flow) ดำเนินการได้อย่างมีประสิทธิภาพ" }, { title: "การจัดหาวัสดุตรงขอบสายการผลิต (Line-side)", detail: "มีเครื่องคัดแยกหรือรางป้อนใกล้ที่ทำงาน จึงสามารถจัดหาชิ้นส่วนได้โดยไม่ต้องเดินหรือไม่ต้องก้มมากเกินไป" }],
            badExamples: [{ title: "ความสูญเปล่าจากการจัดการวัสดุ (Material Handling) ที่มากเกินไป", detail: "เนื่องจากระยะห่างระหว่างกระบวนการไกลกัน จึงเกิดการพึ่งพารถยกหรือรถเข็นในการขนส่งวัสดุมากผิดปกติ" }, { title: "การเพิกเฉยต่อพื้นที่สูญเปล่า (Dead Space)", detail: "มีพื้นที่เหลือเฟือระหว่างเครื่องจักรมากเกินไป และพื้นที่นี้กลายเป็นที่ทิ้งวัสดุที่มีข้อบกพร่องหรือของที่ไม่ได้ใช้ประโยชน์ไปในที่สุด" }],
            color: "#f43f5e"
        },
        {
            id: 6, title: "ระดับสินค้าคงคลังและสินค้าในกระบวนการ (WIP)", subtitle: "Inventory & WIP Levels", focus: "การควบคุมสินค้าคงคลัง: ปริมาณของสินค้าในกระบวนการ (WIP) ที่รออยู่ระหว่างแต่ละกระบวนการได้รับการควบคุมอย่างสมบูรณ์ในระดับระบบและภาพหรือไม่?",
            goodExamples: [{ title: "การกำหนดเขตพื้นที่กันชน (Buffer) ที่ชัดเจน", detail: "พื้นที่จัดเก็บถูกกำหนดอย่างชัดเจน และเมื่อเขตแดนนั้นเต็ม กระบวนการก่อนหน้าจะหยุดทันที" }, { title: "การหมุนเวียนสินค้าคงคลังอย่างรวดเร็ว และเข้าก่อนออกก่อน (FIFO)", detail: "การใช้ป้ายกำกับสินค้าคงคลังมีการปฏิบัติตามหลักการ FIFO อย่างเคร่งครัดและพิสูจน์ได้ว่าระยะเวลาที่สินค้าคงคลังอยู่นิ่งน้อยมาก" }],
            badExamples: [{ title: "การจัดเก็บของบนพื้นดินแบบไร้การควบคุม", detail: "มีกองผลิตภัณฑ์กึ่งสำเร็จรูปที่ไม่ทราบที่มาซึ่งปกคลุมด้วยพลาสติกอยู่บนพื้นหรือทางเดินด้านหน้ากระบวนการต่อไป" }, { title: "สินค้าคงคลังสะสมมหาศาลของผู้ผลิต", detail: "นอกจากจะเป็นการผลิตเพื่อรักษาอัตราการดำเนินงานโดยไม่มีคำสั่งยืนยันของลูกค้าแล้ว ยังมีรายงานว่าพบสินค้าคงคลังจำนวนมากถูกวางฝุ่นเกาะอยู่ที่มุมของคลังสินค้า" }],
            color: "#06b6d4"
        },
        {
            id: 7, title: "การทำงานเป็นทีมและแรงจูงใจพนักงาน", subtitle: "Teamwork & Motivation", focus: "วัฒนธรรมองค์กร: พนักงานในพื้นที่ปฏิบัติงานมีส่วนร่วมในการแก้ปัญหาและกิจกรรมการปรับปรุงอย่างตื่นตัวและมีความรับผิดชอบในเชิงบวกหรือไม่?",
            goodExamples: [{ title: "การกระตุ้นกระดานการปรับปรุงอย่างต่อเนื่อง (Kaizen Board)", detail: "กรณีการปรับปรุง (ก่อนและหลัง) ที่พนักงานเป็นผู้ริเริ่มเสนอถูกแสดงไว้ พร้อมกับระบบการให้รางวัลสำหรับการดำเนินการนี้" }, { title: "การแบ่งปันสถานะการฝึกอบรมทักษะที่หลากหลาย (Multi-skill)", detail: "เพื่อความคล่องตัวในการรับมือกับปัญหาขาดพนักงานแบบยืดหยุ่น เมทริกซ์การฝึกอบรมแบบข้ามหน้าที่ถูกเปิดเผยอย่างโปร่งใส" }],
            badExamples: [{ title: "บรรยากาศในโรงงานที่มีลักษณะเฉื่อยชาและแข็งทื่อ", detail: "คนงานหลีกเลี่ยงการสบตากับผู้เข้าชม และเมื่อเกิดปัญหาในสายงานนอกเหนือจากการดำเนินงานตามปกติ พวกเขากลับเลือกรอผู้บริหาร แทนที่จะแก้ไขผ่านการสื่อสารทางตรง" }, { title: "การแบ่งสภาพแวดล้อมตามลำดับชั้น", detail: "ห้องพักและโรงอาหารที่ใช้ร่วมกันเฉพาะกับผู้บริหารมีความแตกต่างที่ชัดเจนกับสิ่งอำนวยความสะดวกสำหรับพนักงานทั่วไป ซึ่งลดความรู้สึกของการเป็นส่วนหนึ่งในองค์กรลง" }],
            color: "#ec4899"
        },
        {
            id: 8, title: "สถานะการบำรุงรักษาอุปกรณ์ (PM)", subtitle: "Equipment Maintenance", focus: "การควบคุมอุปกรณ์: เครื่องจักรทั้งหมดได้รับการดูแลให้อยู่ในสภาพที่ดีที่สุด และกิจกรรมการบำรุงรักษาเชิงป้องกันถูกดำเนินการโดยผู้ปฏิบัติงานหรือไม่?",
            goodExamples: [{ title: "การตรวจสอบ TPM ประจำวัน", detail: "เครื่องจักรทั้งหมดมีแบบฟอร์มบันทึกการตรวจสอบ (Checklist) และมีบันทึกรายงานการตรวจสอบแรงดันและการต้อนนำสารหล่อลื่นทุกวัน" }, { title: "การตรวจสอบแบบภาพของการทำงานในระดับปกติ", detail: "พื้นที่ปกติ/ระวังบนบอร์ดกระจกของเครื่องจักรจะถูกระบุด้วยฉลากสี ทำให้สามารถรับรู้เมื่อมีอาการผิดปกติได้จากระยะไกล" }],
            badExamples: [{ title: "การซ่อมแซมที่มีลักษณะแก้ไขชั่วคราวเป็นหลัก", detail: "อุปกรณ์จะทำงานจนพังทลาย และมักเห็นร่องรอยการแก้ไขซ่อมแซม (Band-Aid) เช่น การใช้เทปกาวยึด หรือซิปไทป์ ฯลฯ ในหลายกรณี" }],
            color: "#64748b"
        },
        {
            id: 9, title: "ความซับซ้อนและความสามารถในการจัดการความหลากหลาย", subtitle: "Complexity Management", focus: "การตอบสนองด้านความยืดหยุ่น: จัดการกับข้อกำหนดของคำสั่งซื้อที่หลากหลายและการเปลี่ยนแปลงรุ่นผลิตภัณฑ์บ่อยครั้งได้รวดเร็วโดยไม่เกิดข้อบกพร่องหรือคอขวดหรือไม่?",
            goodExamples: [{ title: "ใช้ SMED", detail: "การเปลี่ยนอุปกรณ์สำเร็จรูปถูกจัดการในเวลา 10 นาทีหรือน้อยกว่าโดยใช้กริปเปอร์แบบแม่เหล็ก รถเตรียมการล่วงหน้า ฯลฯ" }, { title: "การป้องกันการเกิดชิ้นส่วนเสีย (Poka-Yoke)", detail: "การรวมกันที่ผิดพลาดจะถูกสกัดโดยการสแกนรหัสส่วนประกอบที่ซับซ้อน หรือระบบป้องกันการประกอบชิ้นส่วนที่ไม่ถูกต้องด้วยระบบบล็อก/สลัก" }],
            badExamples: [{ title: "มีความสูญเปล่าระดับรุนแรง", detail: "ประสิทธิภาพจะลดลงได้มากเพราะผู้ปฏิบัติงานไป-กลับระหว่างคลังสินค้าและสายการประกอบหลายต่อหลายครั้ง และใช้เวลามากกว่า 1 ชั่วโมงสำหรับการปรับตั้งอุปกรณ์เมื่อต้องเปลี่ยนรุ่น" }, { title: "ข้อจำกัดการสื่อสารแบบแมนนวล", detail: "เพราะคำสั่งการทำงานรวมตัวกันเป็นสับสน และการสื่อสารข้อผิดพลาดได้เริ่มต้นเกิดขึ้นอย่างต่อเนื่องในระหว่างการเปลี่ยนรุ่น" }],
            color: "#d946ef"
        },
        {
            id: 10, title: "ระบบแบบบูรณาการ", subtitle: "Supply Chain Integration", focus: "หุ้นส่วน: อนึ่ง กระบวนการการแลกเปลี่ยนกระบวนทัศน์ถูกหลอมเชื่อมในขบวนการจัดส่งให้มีประสิทธิภาพมากขึ้นรึป่าว?",
            goodExamples: [{ title: "ขั้นตอน (Dock-to-Line)", detail: "ไม่ต้องทดสอบคุณภาพการจัดส่ง วัสดุและส่วนประกอบที่ถูกส่งตรงแบบทันเวลา (JIT) ก็เสร็จในทันที" }, { title: "การบูรณาการระบบกับ Dashboard ประสิทธิภาพ", detail: "ผู้บริหารติดตามความตรงเวลา (OTD) รวมถึง ตัวบ่งชี้การบกพร่อง ร่วมกันอย่างต่อเนื่องในอัตราเดียวกัน" }],
            badExamples: [{ title: "อุปสรรคของการระบายวัสดุ", detail: "เพราะผู้พิจารณาไม่เพียงพอ การพิจารณาสินทรัพย์เข้าสู่ระบบจึงล่มและของหายากในคลัง" }, { title: "การลดต้นทุน", detail: "เมื่อเกิดปัญหาด้านคุณภาพไม่วิเคราะห์หรอกแค่ส่งเงินคืนให้เสร็จสรรพ เป็นการทำลายนโยบาย" }],
            color: "#14b8a6"
        },
        {
            id: 11, title: "ให้ความสำคัญกับคุณภาพเป็นลำดับแรก", subtitle: "Commitment to Quality", focus: "ความมุ่งมั่นด้านคุณภาพ: เปิดเผยข้อบกพร่องทันทีโดยไม่ปกปิด ติดตามหาสาเหตุที่แท้จริง (Root Cause) และไม่ส่งต่อข้อบกพร่องไปยังกระบวนการถัดไปหรือไม่?",
            goodExamples: [{ title: "มาตรฐานภายใน (Built-in Quality)", detail: "เมื่อเกิดผลเสียก็ต้องหยุดระบบในทันทีก่อนจะผ่านต่อไป" }, { title: "5-Why System", detail: "เมื่อมีปัญหาไม่เพียงแต่แก้งานใหม่ (Rework) แต่เราใช้ PDCA แล้วค่อยทำการค้นหา" }],
            badExamples: [{ title: "การรื้อระบบใหม่", detail: "เพราะพื้นที่แออัดเลยหาเรื่องทำงานหลาย ๆ อย่างซับซ้อน และทวีวิกฤติให้มากขึ้น" }, { title: "การพยายาม", detail: "พวกเขาเริ่มขาดความมุ่งมั่น และทิ้งเวลาไปอย่างไร้เรี่ยวแรง ไม่กล้าวิเคราะห์" }],
            color: "#ef4444"
        }
    ]
};
