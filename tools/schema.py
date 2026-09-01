"""Schema definitions for parsed assessment data."""

# Domain mapping
DOMAIN_MAP = {
    "ความรู้": "knowledge",
    "knowledge": "knowledge",
    "ทักษะ": "skills",
    "skills": "skills",
    "จริยธรรม": "ethics",
    "ethics": "ethics",
    "ลักษณะบุคคล": "character",
    "character": "character",
    "ลักษณะส่วนบุคคล": "character",
    "ลักษณะ": "character",
}

# Standard 4-level rubric labels
RUBRIC4_LABELS = {
    4: "ระดับดีมาก",
    3: "ระดับดี",
    2: "ระดับพอใช้",
    1: "ระดับควรปรับปรุง",
}

# Standard 4-level (matrix style: ดีเยี่ยม/ดี/พอใช้/ควรปรับปรุง)
MATRIX4_LABELS = {
    4: "ระดับดีเยี่ยม",
    3: "ระดับดี",
    2: "ระดับพอใช้",
    1: "ระดับควรปรับปรุง",
}

# Legacy 5-level rubric labels
RUBRIC5_LABELS = {
    5: "ยอดเยี่ยม",
    4: "ดีมาก",
    3: "ดี",
    2: "พอใช้",
    1: "ต้องปรับปรุง",
}

# Scale status by layout
SCALE_STATUS = {
    "rubric4": "standard_4",
    "rubric5": "legacy_5",
    "matrix": "needs_descriptions",
}
