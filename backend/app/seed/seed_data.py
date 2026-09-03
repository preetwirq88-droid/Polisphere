import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.security import get_password_hash

async def seed():
    print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]

    # 1. Admin User
    await db.admin_users.delete_many({})
    admin_user = {
        "email": "admin@polisphere.app",
        "hashed_password": get_password_hash("AdminPass123!"),
        "name": "Platform Administrator",
        "created_at": datetime.now(timezone.utc)
    }
    await db.admin_users.insert_one(admin_user)
    print("Seeded admin user (admin@polisphere.app / AdminPass123!)")

    # 2. Subjects
    await db.subjects.delete_many({})
    subjects_data = [
        {
            "slug": "modern-political-philosophy",
            "name": "Modern Political Philosophy",
            "description": "Explores key Western thinkers from Hobbes and Locke to Rousseau, Wollstonecraft, and Mill.",
            "icon": "menu_book",
            "order": 1,
            "units": [
                {"unit_number": 1, "title": "What is Theory & Modernity"},
                {"unit_number": 2, "title": "Rousseau & The Social Contract"},
                {"unit_number": 3, "title": "Mary Wollstonecraft & J. S. Mill"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "political-theory",
            "name": "Political Theory",
            "description": "Foundational concepts of sovereignty, justice, liberty, equality, rights, and political obligation.",
            "icon": "account_balance",
            "order": 2,
            "units": [
                {"unit_number": 1, "title": "Concepts of Liberty & Equality"},
                {"unit_number": 2, "title": "Theories of Justice"},
                {"unit_number": 3, "title": "Rights & Citizenship"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "indian-political-thought",
            "name": "Indian Political Thought",
            "description": "Ancient to modern Indian political thinkers including Kautilya, Gandhi, Tagore, and Ambedkar.",
            "icon": "history_edu",
            "order": 3,
            "units": [
                {"unit_number": 1, "title": "Kautilya & Arthashastra"},
                {"unit_number": 2, "title": "Gandhi & Satyagraha"},
                {"unit_number": 3, "title": "Ambedkar & Annihilation of Caste"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "international-relations",
            "name": "International Relations",
            "description": "Realism, Liberalism, Constructivism, global governance, and contemporary geopolitical issues.",
            "icon": "public",
            "order": 4,
            "units": [
                {"unit_number": 1, "title": "Theories of IR"},
                {"unit_number": 2, "title": "Cold War & Post-Cold War Order"},
                {"unit_number": 3, "title": "Global Political Economy"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "comparative-politics",
            "name": "Comparative Politics",
            "description": "Systematic comparison of political institutions, regimes, electoral systems, and state formation.",
            "icon": "compare_arrows",
            "order": 5,
            "units": [
                {"unit_number": 1, "title": "Comparative Methods"},
                {"unit_number": 2, "title": "Regime Types & Transitions"},
                {"unit_number": 3, "title": "Electoral Systems"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "public-administration",
            "name": "Public Administration",
            "description": "Administrative theories, public policy making, bureaucracy, governance, and development administration.",
            "icon": "domain",
            "order": 6,
            "units": [
                {"unit_number": 1, "title": "Classical Administrative Thought"},
                {"unit_number": 2, "title": "New Public Management"},
                {"unit_number": 3, "title": "Public Policy Analysis"}
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]

    inserted_subjects = await db.subjects.insert_many(subjects_data)
    subject_map = {s["slug"]: inserted_subjects.inserted_ids[idx] for idx, s in enumerate(subjects_data)}
    print(f"Seeded {len(subjects_data)} subjects.")

    # 3. Thinkers
    await db.thinkers.delete_many({})
    thinkers_data = [
        {
            "slug": "jean-jacques-rousseau",
            "name": "Jean-Jacques Rousseau",
            "portrait_url": "/assets/rousseau.png",
            "contribution": "General Will & Popular Sovereignty",
            "key_works": ["The Social Contract (1762)", "Emile (1762)", "Discourse on Inequality (1755)"],
            "bio": "Jean-Jacques Rousseau (1712–1778) was a Genevan philosopher whose political philosophy influenced the Progress of the Age of Enlightenment throughout Europe, as well as aspects of the French Revolution and the development of modern political, economic, and educational thought.",
            "related_subject_ids": [subject_map["modern-political-philosophy"]],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "j-s-mill",
            "name": "John Stuart Mill",
            "portrait_url": "/assets/mill.png",
            "contribution": "Harm Principle & Utilitarian Liberty",
            "key_works": ["On Liberty (1859)", "Utilitarianism (1861)", "The Subjection of Women (1869)"],
            "bio": "John Stuart Mill (1806–1873) was an English philosopher, political economist, and Member of Parliament. One of the most influential thinkers in classical liberalism, he contributed widely to social theory, political theory, and political economy.",
            "related_subject_ids": [subject_map["modern-political-philosophy"]],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "b-r-ambedkar",
            "name": "B. R. Ambedkar",
            "portrait_url": "/assets/ambedkar.png",
            "contribution": "Social Democracy & Constitutionalism",
            "key_works": ["Annihilation of Caste (1936)", "States and Minorities (1947)", "The Buddha and His Dhamma (1957)"],
            "bio": "Bhimrao Ramji Ambedkar (1891–1956) was an Indian jurist, economist, social reformer, and political leader who headed the committee drafting the Constitution of India and served as Law and Justice Minister in the first cabinet of Jawaharlal Nehru.",
            "related_subject_ids": [subject_map["indian-political-thought"]],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]
    inserted_thinkers = await db.thinkers.insert_many(thinkers_data)
    print(f"Seeded {len(thinkers_data)} thinkers.")

    # 4. Notes
    await db.notes.delete_many({})
    notes_data = [
        {
            "slug": "rousseau-general-will",
            "title": "Rousseau: The General Will",
            "subject_id": subject_map["modern-political-philosophy"],
            "unit_number": 2,
            "difficulty": "advanced",
            "status": "published",
            "breadcrumb_trail": ["Subjects", "Modern Political Philosophy", "Unit 2: Rousseau"],
            "reading_time_minutes": 15,
            "keywords": ["general will", "social contract", "rousseau", "popular sovereignty", "common good"],
            "sections": [
                {
                    "anchor": "introduction",
                    "heading": "Introduction",
                    "body": "Jean-Jacques Rousseau introduces the concept of the **General Will** (*volonté générale*) in his seminal work, *The Social Contract* (1762). It represents a collective intent aimed specifically at the common good, standing in sharp contrast to private, selfish interests. For Rousseau, true freedom is obtained not by operating outside society, but by obeying laws that express our genuine shared moral purpose."
                },
                {
                    "anchor": "meaning",
                    "heading": "Meaning of General Will",
                    "body": "The General Will is the collective desire of citizens directed strictly towards the **common interest**. Rousseau sharply distinguishes it from the *'Will of All'* (the mere sum total of private individual self-interests). While the Will of All focuses on personal gain, the General Will focuses exclusively on public advantage and universal justice."
                },
                {
                    "anchor": "key-features",
                    "heading": "Key Features",
                    "body": "1. **Infallible:** Rousseau claims the General Will is always right and always tends to public utility, even when individual citizens are misinformed.\n2. **Indivisible & Inalienable:** Sovereignty is the exercise of the General Will; it cannot be transferred, represented, or divided. Rousseau explicitly rejects representative parliamentary democracy in favor of direct participation.\n3. **Absolute:** It exerts absolute sovereignty over all members of the body politic, unified under civil freedom."
                },
                {
                    "anchor": "key-arguments",
                    "heading": "Key Arguments & Sovereign Power",
                    "body": "By entering into the Social Contract, individuals relinquish their natural liberty in exchange for **civil liberty** and moral freedom. Rousseau argues that to obey the General Will is simply to obey oneself, as each citizen is both a sovereign lawmaker and a subject bound by civil law."
                },
                {
                    "anchor": "criticism",
                    "heading": "Criticism & Modern Debates",
                    "body": "Critics such as Isaiah Berlin and Jacob Talmon argue that Rousseau's formula—that one can be 'forced to be free'—contains totalitarian seeds by justifying state coercion in the name of an idealized 'true' interest. Conversely, democratic theorists highlight his radical commitment to popular sovereignty and active civic virtue."
                },
                {
                    "anchor": "exam-questions",
                    "heading": "Exam Questions & Prep",
                    "body": "1. Differentiate between Rousseau's 'General Will' and 'Will of All' with examples.\n2. Evaluate Rousseau's critique of representative democracy in light of modern constitutional systems.\n3. Discuss the paradox of 'forced to be free' in *The Social Contract*."
                }
            ],
            "comparison_table": {
                "title": "Comparison: Social Contract Thinkers",
                "columns": ["Thomas Hobbes", "John Locke", "Jean-Jacques Rousseau"],
                "rows": [
                    {
                        "label": "State of Nature",
                        "values": ["Solitary, poor, nasty, brutish, and short", "Reasonable, moral, but lacking impartial judges", "Peaceful, solitary 'Noble Savage' corrupted by private property"]
                    },
                    {
                        "label": "Sovereignty",
                        "values": ["Absolute Leviathan monarch", "Limited government delegated by consent", "Popular sovereignty through the General Will"]
                    },
                    {
                        "label": "Right to Revolt",
                        "values": ["None (unless life is threatened)", "Yes, if natural rights are violated", "Continuous popular sovereignty; no external ruler"]
                    }
                ]
            },
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "j-s-mill-on-liberty",
            "title": "J.S. Mill: Harm Principle & Freedom of Speech",
            "subject_id": subject_map["modern-political-philosophy"],
            "unit_number": 3,
            "difficulty": "introductory",
            "status": "published",
            "breadcrumb_trail": ["Subjects", "Modern Political Philosophy", "Unit 3: Mill"],
            "reading_time_minutes": 12,
            "keywords": ["mill", "liberty", "harm principle", "utilitarianism", "speech"],
            "sections": [
                {
                    "anchor": "introduction",
                    "heading": "Introduction",
                    "body": "John Stuart Mill's treatise *On Liberty* (1859) remains the foundational defense of individual freedom against state power and societal tyranny. Mill formulates the celebrated **Harm Principle** to establish the moral boundary of collective intervention."
                },
                {
                    "anchor": "harm-principle",
                    "heading": "The Harm Principle",
                    "body": "The sole end for which mankind are warranted, individually or collectively, in interfering with the liberty of action of any of their number is self-protection. Over himself, over his own body and mind, the individual is sovereign."
                }
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "slug": "ambedkar-annihilation-of-caste",
            "title": "Ambedkar: Annihilation of Caste & Social Democracy",
            "subject_id": subject_map["indian-political-thought"],
            "unit_number": 3,
            "difficulty": "advanced",
            "status": "published",
            "breadcrumb_trail": ["Subjects", "Indian Political Thought", "Unit 3: Ambedkar"],
            "reading_time_minutes": 14,
            "keywords": ["ambedkar", "caste", "social democracy", "constitution", "justice"],
            "sections": [
                {
                    "anchor": "introduction",
                    "heading": "Introduction",
                    "body": "Dr. B.R. Ambedkar's undelivered speech *Annihilation of Caste* (1936) is a searing critique of the caste system, Hindu orthodoxy, and social hierarchy in India. Ambedkar argues that political democracy is meaningless without deep-rooted social and economic democracy."
                }
            ],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]

    inserted_notes = await db.notes.insert_many(notes_data)
    print(f"Seeded {len(notes_data)} notes.")

    # 5. Important Questions
    await db.important_questions.delete_many({})
    questions_data = [
        {
            "subject_id": subject_map["modern-political-philosophy"],
            "unit_number": 2,
            "topic": "Social Contract Theory",
            "difficulty": "advanced",
            "question": "Examine Rousseau's concept of the 'General Will'. How does it differ from the 'Will of All', and why is it considered central to democratic legitimacy?",
            "note_id": inserted_notes.inserted_ids[0],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "subject_id": subject_map["modern-political-philosophy"],
            "unit_number": 3,
            "topic": "Liberty & Freedom of Expression",
            "difficulty": "intermediate",
            "question": "Critically analyze J.S. Mill's 'Harm Principle'. Can state intervention be justified on paternalistic grounds under Mill's framework?",
            "note_id": inserted_notes.inserted_ids[1],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "subject_id": subject_map["indian-political-thought"],
            "unit_number": 3,
            "topic": "Social Equality & Constitutional Democracy",
            "difficulty": "advanced",
            "question": "How did B.R. Ambedkar define Social Democracy? Explain his argument in 'Annihilation of Caste' regarding political vs social equality.",
            "note_id": inserted_notes.inserted_ids[2],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "subject_id": subject_map["political-theory"],
            "unit_number": 2,
            "topic": "Theories of Justice",
            "difficulty": "intermediate",
            "question": "Compare John Rawls's 'Veil of Ignorance' with Robert Nozick's Entitlement Theory of Justice.",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "subject_id": subject_map["international-relations"],
            "unit_number": 1,
            "topic": "Realism vs Liberalism",
            "difficulty": "beginner",
            "question": "What are the core assumptions of Structural Realism (Neorealism) according to Kenneth Waltz?",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    await db.important_questions.insert_many(questions_data)
    print(f"Seeded {len(questions_data)} important questions.")

    client.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
