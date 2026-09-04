"use client";

import { useActionState, useEffect, useMemo, useReducer, useState } from "react";
import Link from "next/link";
import type { TemplateDoc, ScaleStatus, Domain } from "@/lib/types";
import { saveTemplateAction } from "./actions";
import { buildStandard4Options, newId } from "@/lib/editor-utils";
import type { EditPayload } from "./actions";

// ---------- State shape ----------

type OptionState = {
  id: string;
  score: number;
  labelTh: string;
  descriptionTh: string | null;
  sequence: number;
};

type QuestionState = {
  id: string;
  loCode: string | null;
  text: string;
  textEn: string | null;
  ploRefs: string[] | null;
  sequence: number;
  options: OptionState[];
};

type SectionState = {
  id: string;
  domainType: Domain;
  titleTh: string;
  part: number;
  sequence: number;
  questions: QuestionState[];
};

type State = {
  templateId: string;
  programId: string;
  title: string;
  programNameTh: string;
  courseCodesText: string; // comma-separated in the UI
  scaleStatus: ScaleStatus;
  sections: SectionState[];
};

// ---------- Convert TemplateDoc → State ----------

function docToState(doc: TemplateDoc): State {
  return {
    templateId: doc.id,
    programId: doc.program.id,
    title: doc.title ?? "",
    programNameTh: doc.program.name_th ?? "",
    courseCodesText: (doc.course_codes ?? []).join(", "),
    scaleStatus: doc.scale_status,
    sections: doc.sections.map((s) => ({
      id: s.id,
      domainType: s.domain_type,
      titleTh: s.title_th,
      part: s.part,
      sequence: s.sequence,
      questions: s.questions.map((q) => ({
        id: q.id,
        loCode: q.lo_code,
        text: q.text,
        textEn: q.text_en,
        ploRefs: q.plo_refs,
        sequence: q.sequence,
        options: q.options.map((o) => ({
          id: o.id,
          score: o.score,
          labelTh: o.label_th,
          descriptionTh: o.description_th,
          sequence: o.sequence,
        })),
      })),
    })),
  };
}

// ---------- Reducer ----------

type Action =
  | { type: "set_title"; value: string }
  | { type: "set_program_name"; value: string }
  | { type: "set_course_codes"; value: string }
  | { type: "set_scale_status"; value: ScaleStatus }
  | { type: "add_section"; part: number }
  | { type: "update_section"; sectionId: string; patch: Partial<Pick<SectionState, "titleTh" | "part" | "domainType">> }
  | { type: "delete_section"; sectionId: string }
  | { type: "add_question"; sectionId: string }
  | { type: "update_question"; sectionId: string; questionId: string; patch: Partial<Pick<QuestionState, "loCode" | "text" | "textEn" | "ploRefs">> }
  | { type: "delete_question"; sectionId: string; questionId: string }
  | { type: "add_option"; sectionId: string; questionId: string }
  | { type: "update_option"; sectionId: string; questionId: string; optionId: string; patch: Partial<Pick<OptionState, "score" | "labelTh" | "descriptionTh">> }
  | { type: "delete_option"; sectionId: string; questionId: string; optionId: string }
  | { type: "replace_options_with_standard_4"; sectionId: string; questionId: string }
  | { type: "load"; state: State };

function reindex<T extends { sequence: number }>(arr: T[]): T[] {
  return arr.map((item, i) => ({ ...item, sequence: i + 1 }));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load":
      return action.state;
    case "set_title":
      return { ...state, title: action.value };
    case "set_program_name":
      return { ...state, programNameTh: action.value };
    case "set_course_codes":
      return { ...state, courseCodesText: action.value };
    case "set_scale_status":
      return { ...state, scaleStatus: action.value };
    case "add_section": {
      const seq = state.sections.length + 1;
      const section: SectionState = {
        id: newId(),
        domainType: "knowledge",
        titleTh: "",
        part: action.part,
        sequence: seq,
        questions: [],
      };
      return { ...state, sections: [...state.sections, section] };
    }
    case "update_section":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId ? { ...s, ...action.patch } : s
        ),
      };
    case "delete_section":
      return {
        ...state,
        sections: reindex(state.sections.filter((s) => s.id !== action.sectionId)),
      };
    case "add_question": {
      const question: QuestionState = {
        id: newId(),
        loCode: null,
        text: "",
        textEn: null,
        ploRefs: null,
        sequence: 0,
        options: buildStandard4Options(),
      };
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? { ...s, questions: reindex([...s.questions, question]) }
            : s
        ),
      };
    }
    case "update_question":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                questions: s.questions.map((q) =>
                  q.id === action.questionId ? { ...q, ...action.patch } : q
                ),
              }
            : s
        ),
      };
    case "delete_question":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? { ...s, questions: reindex(s.questions.filter((q) => q.id !== action.questionId)) }
            : s
        ),
      };
    case "add_option": {
      const option: OptionState = {
        id: newId(),
        score: 1,
        labelTh: "",
        descriptionTh: null,
        sequence: 0,
      };
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                questions: s.questions.map((q) =>
                  q.id === action.questionId
                    ? { ...q, options: reindex([...q.options, option]) }
                    : q
                ),
              }
            : s
        ),
      };
    }
    case "update_option":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                questions: s.questions.map((q) =>
                  q.id === action.questionId
                    ? {
                        ...q,
                        options: q.options.map((o) =>
                          o.id === action.optionId ? { ...o, ...action.patch } : o
                        ),
                      }
                    : q
                ),
              }
            : s
        ),
      };
    case "delete_option":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                questions: s.questions.map((q) =>
                  q.id === action.questionId
                    ? { ...q, options: reindex(q.options.filter((o) => o.id !== action.optionId)) }
                    : q
                ),
              }
            : s
        ),
      };
    case "replace_options_with_standard_4":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                questions: s.questions.map((q) =>
                  q.id === action.questionId
                    ? { ...q, options: buildStandard4Options() }
                    : q
                ),
              }
            : s
        ),
      };
    default:
      return state;
  }
}

// ---------- Helpers ----------

function parseCourseCodes(text: string): string[] | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  return trimmed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function stateToPayload(state: State): EditPayload {
  return {
    templateId: state.templateId,
    programId: state.programId,
    title: state.title.trim() || null,
    programNameTh: state.programNameTh.trim(),
    courseCodes: parseCourseCodes(state.courseCodesText),
    scaleStatus: "standard_4",
    sections: state.sections.map((s) => ({
      id: s.id,
      titleTh: s.titleTh,
      part: s.part,
      sequence: s.sequence,
      questions: s.questions.map((q) => ({
        id: q.id,
        loCode: q.loCode?.trim() || null,
        text: q.text,
        textEn: q.textEn?.trim() || null,
        ploRefs: q.ploRefs,
        sequence: q.sequence,
        options: q.options.map((o) => ({
          id: o.id,
          score: o.score,
          labelTh: o.labelTh,
          descriptionTh: o.descriptionTh,
          sequence: o.sequence,
        })),
      })),
    })),
  };
}

// ---------- Small UI atoms ----------

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-border-strong bg-raised px-3.5 py-2.5 text-base text-primary placeholder:text-tertiary transition-colors hover:border-border-focus focus-visible:border-border-focus";

const labelClass = "block text-sm font-medium text-primary";

const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border-strong bg-raised px-3 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover";
const btnDanger =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-error-text/30 bg-error-bg px-3 text-sm font-medium text-error-text transition-colors hover:bg-error-bg/80";
const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-action px-4 text-sm font-medium text-inverse transition-colors hover:bg-action-hover disabled:opacity-50";

function ConfirmDelete({ label, detail, onConfirm }: { label: string; detail: string; onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return <button type="button" className={btnDanger} onClick={() => setConfirming(true)}>{label}</button>;
  }

  return (
    <div className="rounded-lg border border-error-text/30 bg-error-bg p-3" role="group" aria-label={`ยืนยัน${label}`}>
      <p className="max-w-sm text-sm text-primary">{detail}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className={btnDanger} onClick={onConfirm}>ยืนยันลบ</button>
        <button type="button" className={btn} onClick={() => setConfirming(false)}>ยกเลิก</button>
      </div>
    </div>
  );
}

// ---------- Editor ----------

export function TemplateEditor({ doc, programKey }: { doc: TemplateDoc; programKey: string }) {
  const [state, reduce] = useReducer(reducer, doc, docToState);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const dispatch = (action: Action) => {
    setHasChanges(true);
    reduce(action);
  };
  const payload = useMemo(() => stateToPayload(state), [state]);
  const [saveState, formAction, pending] = useActionState(saveTemplateAction, null);

  const lastError = saveState && !saveState.ok ? saveState.error : null;
  const savedOk = saveState?.ok === true;

  useEffect(() => {
    if (!hasChanges) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasChanges]);

  return (
    <form
      action={formAction}
      className="space-y-8"
      onSubmit={() => {
        setHasChanges(false);
        setConfirmLeave(false);
      }}
      onInvalid={(event) => {
        let parent = (event.target as HTMLElement).closest("details");
        while (parent) {
          parent.open = true;
          parent = parent.parentElement?.closest("details") ?? null;
        }
      }}
    >
      <input type="hidden" name="templateId" value={state.templateId} />
      <input type="hidden" name="programId" value={state.programId} />
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      {/* Save bar */}
      <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border-strong bg-raised/95 px-4 py-3 shadow-sm backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="text-sm" aria-live="polite">
          {pending ? (
            <><span className="font-semibold text-primary">กำลังบันทึก</span><span className="ml-2 text-secondary">โปรดรอสักครู่…</span></>
          ) : lastError ? (
            <span className="text-error-text" role="alert">บันทึกไม่สำเร็จ: {lastError}</span>
          ) : hasChanges ? (
            <><span className="font-semibold text-warning-text">มีการแก้ไขที่ยังไม่บันทึก</span><span className="ml-2 text-secondary">กดบันทึกเมื่อพร้อม</span></>
          ) : savedOk ? (
            <span className="font-medium text-success-text">บันทึกเรียบร้อยแล้ว</span>
          ) : (
            <span className="text-secondary">การเปลี่ยนแปลงจะยังไม่เผยแพร่จนกว่าจะบันทึก</span>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {confirmLeave ? (
            <>
              <span className="self-center text-sm text-warning-text">ยังไม่ได้บันทึกการแก้ไข</span>
              <Link href={`/programs/${programKey}`} className={btnDanger}>
                ออกโดยไม่บันทึก
              </Link>
              <button type="button" className={btn} onClick={() => setConfirmLeave(false)}>
                แก้ไขต่อ
              </button>
            </>
          ) : (
            <Link
              href={`/programs/${programKey}`}
              className={btn}
              onClick={(event) => {
                if (!hasChanges) return;
                event.preventDefault();
                setConfirmLeave(true);
              }}
            >
              ยกเลิก
            </Link>
          )}
          <button type="submit" disabled={pending || (!hasChanges && !lastError)} className={btnPrimary}>
            {pending ? "กำลังบันทึก…" : hasChanges || lastError ? "บันทึกการเปลี่ยนแปลง" : "บันทึกแล้ว"}
          </button>
        </div>
      </div>

      {/* Template-level fields */}
      <section className="rounded-xl border border-border-default bg-raised p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-primary">ข้อมูลทั่วไปของแบบประเมิน</h2>
        <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="programNameTh" className={labelClass}>ชื่อหลักสูตร</label>
            <input
              id="programNameTh"
              type="text"
              className={inputClass}
              value={state.programNameTh}
              onChange={(e) => dispatch({ type: "set_program_name", value: e.target.value })}
              placeholder="เช่น หลักสูตรภาษาไทย"
            />
          </div>
          <div className="sm:col-span-2">
            <span className={labelClass}>ระดับคะแนนที่ใช้</span>
            <p className="text-sm text-secondary">4 ระดับมาตรฐาน (บังคับใช้)</p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="space-y-6">
        {state.sections.map((section, sIdx) => (
          <details key={section.id} className="group rounded-xl border border-border-default bg-raised">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-action">ตอนที่ {section.part} · หมวดที่ {sIdx + 1}</p>
                <h2 className="truncate text-base font-semibold text-primary">{section.titleTh || "หมวดที่ยังไม่มีชื่อ"}</h2>
                <p className="mt-0.5 text-xs text-secondary">{section.questions.length} คำถาม</p>
              </div>
              <span className="shrink-0 text-sm font-medium text-action group-open:hidden">เปิดแก้ไข</span>
              <span className="hidden shrink-0 text-sm font-medium text-secondary group-open:inline">ย่อหมวด</span>
            </summary>
            <div className="border-t border-border-default px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-default pb-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-action">
                  ตอนที่ {section.part} · หมวดที่ {sIdx + 1}
                </p>
                <input
                  type="text"
                  className={`${inputClass} mt-1 text-base font-semibold`}
                  value={section.titleTh}
                  onChange={(e) =>
                    dispatch({
                      type: "update_section",
                      sectionId: section.id,
                      patch: { titleTh: e.target.value },
                    })
                  }
                  placeholder="ชื่อหมวด เช่น ผลลัพธ์การเรียนรู้ด้านความรู้และทักษะ"
                />
                <div className="mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`part-${section.id}`} className="text-xs font-medium text-secondary">ตอนที่ (Part)</label>
                    <select
                      id={`part-${section.id}`}
                      className={`${inputClass} mt-1`}
                      value={section.part}
                      onChange={(e) =>
                        dispatch({
                          type: "update_section",
                          sectionId: section.id,
                          patch: { part: Number(e.target.value) },
                        })
                      }
                    >
                      <option value={1}>ตอนที่ 1 — ความรู้/ทักษะ</option>
                      <option value={2}>ตอนที่ 2 — ทักษะทางสังคม</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`domain-${section.id}`} className="text-xs font-medium text-secondary">ประเภทโดเมน</label>
                    <select
                      id={`domain-${section.id}`}
                      className={`${inputClass} mt-1`}
                      value={section.domainType}
                      onChange={(e) =>
                        dispatch({
                          type: "update_section",
                          sectionId: section.id,
                          patch: { domainType: e.target.value as Domain },
                        })
                      }
                    >
                      <option value="knowledge">ความรู้</option>
                      <option value="skills">ทักษะ</option>
                      <option value="ethics">จริยธรรม</option>
                      <option value="character">ลักษณะบุคคล</option>
                      <option value="general">ทั่วไป</option>
                    </select>
                  </div>
                </div>
              </div>
              <ConfirmDelete
                label="ลบหมวด"
                detail={`ลบหมวดนี้พร้อมคำถาม ${section.questions.length} ข้อหรือไม่? การลบจะมีผลเมื่อบันทึก`}
                onConfirm={() => dispatch({ type: "delete_section", sectionId: section.id })}
              />
            </div>

            {/* Questions */}
            <div className="mt-5 space-y-5">
              {section.questions.map((question, qIdx) => (
                <details key={question.id} className="group/question border-b border-border-default last:border-b-0">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 marker:hidden">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-secondary">ข้อที่ {qIdx + 1} · {question.loCode || "ยังไม่มีรหัส LO"}</p>
                      <p className="truncate text-sm font-medium text-primary">{question.text || "คำถามที่ยังไม่มีข้อความ"}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-action group-open/question:hidden">แก้ไข</span>
                    <span className="hidden shrink-0 text-xs font-medium text-secondary group-open/question:inline">ย่อ</span>
                  </summary>
                  <div className="border-t border-border-default py-4">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-3">
                      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-[8rem_1fr]">
                        <div>
                          <label htmlFor={`lo-${question.id}`} className="text-xs font-medium text-secondary">รหัส LO</label>
                          <input
                            id={`lo-${question.id}`}
                            type="text"
                            className={`${inputClass} mt-1`}
                            value={question.loCode ?? ""}
                            onChange={(e) =>
                              dispatch({
                                type: "update_question",
                                sectionId: section.id,
                                questionId: question.id,
                                patch: { loCode: e.target.value || null },
                              })
                            }
                            placeholder="LO1"
                          />
                        </div>
                        <div>
                          <label htmlFor={`text-${question.id}`} className="text-xs font-medium text-secondary">ข้อความคำถาม (TH) *</label>
                          <textarea
                            id={`text-${question.id}`}
                            className={`${inputClass} mt-1 resize-y`}
                            rows={2}
                            value={question.text}
                            onChange={(e) =>
                              dispatch({
                                type: "update_question",
                                sectionId: section.id,
                                questionId: question.id,
                                patch: { text: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`texten-${question.id}`} className="text-xs font-medium text-secondary">ข้อความคำถาม (EN)</label>
                        <input
                          id={`texten-${question.id}`}
                          type="text"
                          className={`${inputClass} mt-1`}
                          value={question.textEn ?? ""}
                          onChange={(e) =>
                            dispatch({
                              type: "update_question",
                              sectionId: section.id,
                              questionId: question.id,
                              patch: { textEn: e.target.value || null },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor={`plo-${question.id}`} className="text-xs font-medium text-secondary">อ้างอิง PLO (คั่นด้วยจุลภาค)</label>
                        <input
                          id={`plo-${question.id}`}
                          type="text"
                          className={`${inputClass} mt-1`}
                          value={(question.ploRefs ?? []).join(", ")}
                          onChange={(e) =>
                            dispatch({
                              type: "update_question",
                              sectionId: section.id,
                              questionId: question.id,
                              patch: {
                                ploRefs: e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              },
                            })
                          }
                          placeholder="PLO1, PLO2"
                        />
                      </div>

                      {/* Options */}
                      <details className="group/options mt-4 border-t border-border-default pt-3">
                        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between marker:hidden">
                          <span className="text-xs font-semibold text-secondary">ตัวเลือกคะแนน ({question.options.length})</span>
                          <span className="text-xs font-medium text-action group-open/options:hidden">แสดงเกณฑ์คะแนน</span>
                          <span className="hidden text-xs font-medium text-secondary group-open/options:inline">ซ่อนเกณฑ์คะแนน</span>
                        </summary>
                        <div className="pt-3">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              className={btn}
                              onClick={() =>
                                dispatch({
                                  type: "replace_options_with_standard_4",
                                  sectionId: section.id,
                                  questionId: question.id,
                                })
                              }
                            >
                              ใช้ 4 ระดับมาตรฐาน
                            </button>
                            <button
                              type="button"
                              className={btn}
                              onClick={() =>
                                dispatch({
                                  type: "add_option",
                                  sectionId: section.id,
                                  questionId: question.id,
                                })
                              }
                            >
                              + เพิ่มตัวเลือก
                            </button>
                          </div>
                        </div>
                        <ul className="mt-3 space-y-2">
                          {question.options.map((option) => (
                            <li key={option.id} className="grid gap-2 sm:grid-cols-[5rem_1fr_2fr_auto]">
                              <input
                                type="number"
                                min={1}
                                max={5}
                                className={inputClass}
                                value={option.score}
                                onChange={(e) =>
                                  dispatch({
                                    type: "update_option",
                                    sectionId: section.id,
                                    questionId: question.id,
                                    optionId: option.id,
                                    patch: { score: Number(e.target.value) },
                                  })
                                }
                                aria-label="คะแนน"
                              />
                              <input
                                type="text"
                                className={inputClass}
                                value={option.labelTh}
                                onChange={(e) =>
                                  dispatch({
                                    type: "update_option",
                                    sectionId: section.id,
                                    questionId: question.id,
                                    optionId: option.id,
                                    patch: { labelTh: e.target.value },
                                  })
                                }
                                placeholder="ชื่อระดับ เช่น ระดับดีมาก"
                                aria-label="ชื่อระดับ"
                              />
                              <input
                                type="text"
                                className={inputClass}
                                value={option.descriptionTh ?? ""}
                                onChange={(e) =>
                                  dispatch({
                                    type: "update_option",
                                    sectionId: section.id,
                                    questionId: question.id,
                                    optionId: option.id,
                                    patch: { descriptionTh: e.target.value || null },
                                  })
                                }
                                placeholder="คำอธิบายเกณฑ์ (แนะนำให้กรอก)"
                                aria-label="คำอธิบายเกณฑ์"
                              />
                              <ConfirmDelete
                                label="ลบตัวเลือก"
                                detail={`ลบตัวเลือกคะแนน ${option.score} หรือไม่?`}
                                onConfirm={() =>
                                  dispatch({
                                    type: "delete_option",
                                    sectionId: section.id,
                                    questionId: question.id,
                                    optionId: option.id,
                                  })
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                    <div className="flex justify-end">
                      <ConfirmDelete
                        label="ลบข้อ"
                        detail={`ลบ ${question.loCode || `คำถามข้อที่ ${qIdx + 1}`} พร้อมตัวเลือกทั้งหมดหรือไม่?`}
                        onConfirm={() =>
                          dispatch({
                            type: "delete_question",
                            sectionId: section.id,
                            questionId: question.id,
                          })
                        }
                      />
                    </div>
                  </div>
                  </div>
                </details>
              ))}
              <button
                type="button"
                className={`${btn} w-full`}
                onClick={() => dispatch({ type: "add_question", sectionId: section.id })}
              >
                + เพิ่มคำถามในหมวดนี้
              </button>
            </div>
            </div>
          </details>
        ))}
      </div>

      {/* Add section */}
      <div className="flex flex-wrap gap-3">
        <button type="button" className={btn} onClick={() => dispatch({ type: "add_section", part: 1 })}>
          + เพิ่มหมวด (ตอนที่ 1)
        </button>
        <button type="button" className={btn} onClick={() => dispatch({ type: "add_section", part: 2 })}>
          + เพิ่มหมวด (ตอนที่ 2)
        </button>
      </div>
    </form>
  );
}
