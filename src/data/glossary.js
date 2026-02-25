export const glossary = [
    {
        id: 'kanban',
        keys: ['Kanban', 'kanban', '간판', '칸반', 'かんばん', '看板', 'คัมบัง'],
        title: {
            en: 'Kanban',
            ko: '칸반 (Kanban / 간판)',
            ja: 'かんばん (Kanban)',
            zh: '看板 (Kanban)',
            th: 'คัมบัง (Kanban)'
        },
        desc: {
            en: 'A visual scheduling system for lean and JIT manufacturing. It controls the logistical chain from a production point of view, reducing inventory and overproduction.',
            ko: '린 생산 및 JIT(적시 생산) 방식에서 사용되는 시각적 작업 지시 도구입니다. 후공정이 전공정에서 필요한 부품만 꺼내 가도록 하여 과잉 생산 및 불필요한 재고를 방지합니다.',
            ja: 'JIT生産システムにおいて、工程間の生産指示や部品の納入指示に使われる視覚的な道具であり、過剰生産を防ぎます。',
            zh: '一种用于精益制造和JIT生产的视觉调度系统。通过信号控制生产和库存，避免生产过剩。',
            th: 'ระบบเครื่องมือควบคุมการผลิตด้วยการมองเห็น ช่วยลดสินค้าคงคลังและการผลิตที่มากเกินไป'
        }
    },
    {
        id: 'kaizen',
        keys: ['Kaizen', 'kaizen', '카이젠', '개선', '改善', 'ไคเซ็น'],
        title: {
            en: 'Kaizen',
            ko: '카이젠 (Kaizen / 지속적 개선)',
            ja: '改善 (Kaizen)',
            zh: '改善 (Kaizen)',
            th: 'ไคเซ็น (Kaizen)'
        },
        desc: {
            en: 'A Japanese business philosophy of continuous improvement of working practices, personal efficiency, etc.',
            ko: '"지속적인 개선"을 뜻하는 일본어에서 유래한 현장 혁신 철학입니다. 관리자부터 작업자까지 모든 직원이 참여하여 낭비를 줄이고 생산성을 높이는 일상적인 개선 활동을 의미합니다.',
            ja: '作業の無駄をなくし、より効率的な方法を継続的に見つけ出すための全社的な活動です。',
            zh: '日本的一种企业管理哲学，强调持续不断地改进工作流程、提高个人和团队效率。',
            th: 'แนวคิดการปรับปรุงอย่างต่อเนื่องที่ทุกคนในองค์กรมีส่วนร่วม เพื่อลดความสูญเปล่า'
        }
    },
    {
        id: 'andon',
        keys: ['Andon', 'andon', '안돈', '행등', 'アンドン', '安灯', 'อันดง'],
        title: {
            en: 'Andon',
            ko: '안돈 (Andon)',
            ja: 'アンドン (Andon)',
            zh: '安灯 (Andon)',
            th: 'อันดง (Andon)'
        },
        desc: {
            en: 'A visual management tool that highlights the status of operations, instantly alerting management and workers to anomalies or problems.',
            ko: '현장에 이상이 발생했을 때 작업자가 즉각적으로 관리자 및 동료에게 알릴 수 있도록 하는 시각적 경보 시스템(램프, 디스플레이 등)입니다. 신속한 문제 해결을 돕습니다.',
            ja: '生産ラインの異常を知らせるためのランプや表示板による視覚的な管理ツールです。',
            zh: '一种视觉管理工具，用于指示操作的当前状态，并在出现异常时立即向管理层和工人发出警报。',
            th: 'ระบบสัญญาณเตือนด้วยภาพ เพื่อแจ้งให้วิศวกรและผู้จัดการทราบเมื่อเกิดความผิดปกติในสายการผลิต'
        }
    },
    {
        id: 'smed',
        keys: ['SMED', 'smed', '초고속 금형 교환', '금형 교체', '快速换模', 'การเปลี่ยนแม่พิมพ์อย่างรวดเร็ว'],
        title: {
            en: 'SMED (Single-Minute Exchange of Die)',
            ko: 'SMED (초고속 금형 교체)',
            ja: 'SMED (シングル段取り)',
            zh: 'SMED (快速换模)',
            th: 'SMED (การเปลี่ยนแม่พิมพ์อย่างรวดเร็ว)'
        },
        desc: {
            en: 'A lean production method for reducing the time it takes to complete equipment changeovers, ideally to under 10 minutes.',
            ko: '설비의 작업 전환이나 금형 교체 시 걸리는 시간을 혁신적으로 단축하여 \'10분 이내(Single-Minute)\'로 완료하는 것을 목표로 하는 린 생산 기법입니다. 유연한 다품종 소량 생산을 가능하게 합니다.',
            ja: '設備の段取り替えを10分以内に行うことを目指す手法で、多品種少量生産を可能にします。',
            zh: '一种精益生产方法，旨在将设备换模或转换时间缩短至10分钟以内。',
            th: 'เทคนิคในการลดเวลาการตั้งเครื่องจักรหรือการเปลี่ยนแม่พิมพ์ให้เหลือน้อยกว่า 10 นาที'
        }
    },
    {
        id: 'tpm',
        keys: ['TPM', 'tpm', '종합 설비 보전', '종합 보전', 'Total Productive Maintenance', '全員参加の生産保全', '全员生产维护', 'การบำรุงรักษาทวีผลที่ทุกคนมีส่วนร่วม'],
        title: {
            en: 'TPM (Total Productive Maintenance)',
            ko: 'TPM (종합 설비 보전)',
            ja: 'TPM (全員参加の生産保全)',
            zh: 'TPM (全员生产维护)',
            th: 'TPM (การบำรุงรักษาทวีผลที่ทุกคนมีส่วนร่วม)'
        },
        desc: {
            en: 'A system of maintaining and improving the integrity of production and quality systems, aiming for zero breakdowns, zero small stops, and zero defects.',
            ko: '생산성을 저해하는 설비의 고장, 속도 저하, 불량 등을 0(Zero)으로 만들기 위해 전 직원이 참여하는 설비 보전 유지 관리 활동입니다.',
            ja: '機械設備の故障ゼロ、不良ゼロを目指し、全員参加で行う保全活動です。',
            zh: '旨在通过全员参与，实现设备零故障、零停机和零缺陷的生产和质量维护系统。',
            th: 'ระบบการบำรุงรักษาเพื่อเพิ่มประสิทธิภาพโดยรวมของเครื่องจักร โดยทุกคนมีส่วนร่วมเพื่อไม่ให้มีความสูญเสียใดๆ เกิดขึ้น'
        }
    },
    {
        id: 'pokayoke',
        keys: ['Poka-Yoke', 'poka-yoke', '포카요케', '오작동 방지', 'ポカヨケ', '防错', 'โปกะ-โยเกะ'],
        title: {
            en: 'Poka-Yoke',
            ko: '포카요케 (Poka-Yoke / 오작동 방지)',
            ja: 'ポカヨケ',
            zh: '防错 (Poka-Yoke)',
            th: 'โปกะ-โยเกะ (Poka-Yoke)'
        },
        desc: {
            en: 'Any mechanism in a process that helps an equipment operator avoid (yokeru) mistakes (poka).',
            ko: '작업자의 부주의나 실수(Poka)로 인한 불량 자체를 물리적으로 원천 차단(Yoke)할 수 있도록 설계된 바보 방지 툴이나 메커니즘을 말합니다.',
            ja: '作業者がミス（ポカ）を犯しても不良品が発生しないようにする（ヨケ）ための物理的な仕組みです。',
            zh: '防止错误的机制，确保操作员不会犯简单的错误，从而从根源上消除缺陷。',
            th: 'กลไกหรือวิธีการในการป้องกันการทำงานที่ผิดพลาดของพนักงาน ซึ่งเป็นสาเหตุของของเสีย'
        }
    },
    {
        id: 'wip',
        keys: ['WIP', 'wip', '재공품', '악성 재공품', 'Work In Progress', '仕掛品', '在制品', 'งานระหว่างทำ'],
        title: {
            en: 'WIP (Work In Progress)',
            ko: 'WIP (재공품)',
            ja: 'WIP (仕掛品)',
            zh: 'WIP (在制品)',
            th: 'WIP (งานระหว่างทำ)'
        },
        desc: {
            en: 'Materials and components that have begun the manufacturing process but are not yet finished products.',
            ko: '공장에 투입되어 공정을 거치고 있지만 아직 완제품이 되지 않은 중간 조립 상태의 자재들을 말합니다. WIP가 과도하게 쌓여 있으면(악성 재공품) 창고 비용과 현금 흐름 관리에 심각한 악영향을 줍니다.',
            ja: '製造工程の途中にあり、まだ完成していない製品や部品のことです。過剰な仕掛品はキャッシュフローを悪化させます。',
            zh: '已经开始制造流程但尚未成为制成品的物料和组件。过多的WIP代表资金闲置和生产瓶颈。',
            th: 'สินค้าที่อยู่ระหว่างกระบวนการผลิต ยังไม่เสร็จสมบูรณ์ WIP ที่มากเกินไปส่งผลเสียต่อกระแสเงินสดและพื้นที่จัดเก็บ'
        }
    },
    {
        id: 'pacemaker',
        keys: ['Pacemaker', 'pacemaker', '페이스메이커', '단일 페이스메이커', 'ペースメーカー', '领跑者', 'ตัวกำหนดจังหวะ'],
        title: {
            en: 'Pacemaker Process',
            ko: '페이스메이커 (Pacemaker) 공정',
            ja: 'ペースメーカー工程',
            zh: '起搏器/领跑者工序 (Pacemaker)',
            th: 'กระบวนการกำหนดจังหวะ (Pacemaker)'
        },
        desc: {
            en: 'A distinct process in a continuous flow that sets the pace of production for all preceding and downstream processes.',
            ko: '전체 공정의 생산 속도를 조율하고 지휘하는 리더 역할을 하는 핵심 공정입니다. 이곳에만 작업 지시를 내리면 이전 공정(PULL 방식)과 이후 공정(PUSH 방식)이 물 흐르듯 연계됩니다.',
            ja: '生産ライン全体のスピードを決定し、コントロールする基準となる工程です。',
            zh: '用于控制整个价值流生产节奏的关键工序，通常客户订单会直接下达到这个工序。',
            th: 'กระบวนการที่มีความสำคัญในการกำหนดจังหวะการผลิตของกระบวนการทั้งหมดในสายการผลิต'
        }
    },
    {
        id: 'onewayflow',
        keys: ['One-Way Flow', 'one-way flow', '단일 흐름', '단일 흐름 전개', '一方向のフロー', '单向流', 'การไหลทางเดียว'],
        title: {
            en: 'One-Way Flow',
            ko: '단일 흐름 전개 (One-Way Flow)',
            ja: '一方向のフロー',
            zh: '单向流 (One-Way Flow)',
            th: 'การไหลทางเดียว (One-Way Flow)'
        },
        desc: {
            en: 'A production sequence where items move strictly in one direction from raw material to finished product, avoiding backtracking, intersecting lines, or physical detours.',
            ko: '원자재 투입부터 제품 포장까지 생산물이 역행하거나 꼬이지 않고 일방향으로만 부드럽게 흘러가도록 하는 공장 설계 레이아웃 및 린(Lean) 원칙입니다.',
            ja: '部品や製品が後戻りや交差することなく、一方通行で滑らかに流れるようにする生産ラインのレイアウトです。',
            zh: '确保物料从原材料到成品的移动严格遵循一个方向，避免倒退、交叉或复杂的迂回。',
            th: 'การไหลของชิ้นงานหรือสินค้าไปในทิศทางเดียว ไม่มีการไหลย้อนกลับหรือไขว้กัน ช่วยลดความสับสนและเวลาสูญเปล่า'
        }
    }
];
