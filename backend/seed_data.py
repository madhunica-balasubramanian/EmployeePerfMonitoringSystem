from sqlalchemy.orm import Session
from sqlalchemy import text

def seed_metric_definition_roles(db: Session):
    # Mapping of (department_id, role_id) -> applicable metric_ids
    role_metric_mappings = {
        (1, 1): [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        (1, 2): [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        (2, 4): [21, 22, 23, 18, 27, 29, 30, 9, 10, 11, 12, 31, 32],
        (2, 5): [18, 19, 20, 24, 25, 26, 27, 33, 34, 35, 9, 10, 11, 12]
    }

    for (dept_id, role_id), metric_ids in role_metric_mappings.items():
        for metric_id in metric_ids:
            db.execute(text("""
                INSERT INTO metric_definition_roles (metric_id, role_id)
                SELECT :metric_id, :role_id
                WHERE NOT EXISTS (
                    SELECT 1 FROM metric_definition_roles
                    WHERE metric_id = :metric_id AND role_id = :role_id
                )
            """), {"metric_id": metric_id, "role_id": role_id})
            print(f"✔️ Mapped metric {metric_id} to role {role_id}")

    db.commit()
    print("✅ Role-metric mapping complete.")
