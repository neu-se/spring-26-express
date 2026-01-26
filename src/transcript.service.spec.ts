import { beforeEach, describe, expect, it } from "vitest";
import { TranscriptDB } from "./transcript.service.ts";

let db: TranscriptDB;
beforeEach(() => {
  db = new TranscriptDB();
});

describe(`addStudent()`, () => {
  it(`should give students different IDs`, () => {
    const id1 = db.addStudent("Alvin");
    const id2 = db.addStudent("Bryn");
    const id3 = db.addStudent("Carol");
    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  it(`should allow students with the same name`, () => {
    const id1 = db.addStudent("Alvin");
    const id2 = db.addStudent("Alvin");
    expect(id1).not.toBe(id2);
  });
});

describe(`getTranscript()`, () => {
  it(`should return an empty transcript for a new student`, async () => {
    const id = await db.addStudent("Carol");
    expect(await db.getTranscript(id)).toStrictEqual({
      student: { studentName: "Carol", studentID: id },
      grades: [],
    });
  });

  it(`should throw an error for a non-existent student`, async () => {
    const id = await db.addStudent("Carol");
    await expect(db.getTranscript(id + 1)).rejects.toThrow();
  });
});

describe(`addGrade()`, () => {
  it(`should successfully add a new element to an empty transcript`, async () => {
    const id = await db.addStudent("Carol");
    await db.addGrade(id, "Math", 91);
    expect(await db.getTranscript(id)).toStrictEqual({
      student: { studentName: "Carol", studentID: id },
      grades: [{ course: "Math", grade: 91 }],
    });
  });

  it(`should throw if given an invalid id`, async () => {
    // All IDs are invalid in the initial database... including 1.5
    await expect(db.addGrade("4", "Math", 91)).rejects.toThrow();
  });

  it(`should attach different grades to different students`, async () => {
    const id1 = await db.addStudent("Carol");
    const id2 = await db.addStudent("Darol");
    await db.addGrade(id1, "Math", 91);
    await db.addGrade(id2, "Math", 87);
    expect((await db.getTranscript(id1)).grades).toStrictEqual([{ course: "Math", grade: 91 }]);
    expect((await db.getTranscript(id2)).grades).toStrictEqual([{ course: "Math", grade: 87 }]);
  });

  it(`should permit multiple grades for a single class`, async () => {
    const id = await db.addStudent("Eris");
    await db.addGrade(id, "Math", 91);
    await db.addGrade(id, "Math", 87);
    expect((await db.getTranscript(id)).grades.sort((a, b) => a.grade - b.grade)).toStrictEqual([
      { course: "Math", grade: 87 },
      { course: "Math", grade: 91 },
    ]);
  });
});
