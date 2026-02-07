import { Keyv } from "keyv";
import { randomUUID } from "node:crypto";
import { type StudentID, type Student, type Course, type Transcript } from "./types.ts";

export class TranscriptDB {
  /**
   * The list of transcripts in the database
   */
  private _transcripts: Keyv<Transcript> = new Keyv();

  /**
   * Adds a new student to the database
   * @param {string} newName - the name of the student
   * @returns {StudentID} - the newly-assigned ID for the new student
   */
  async addStudent(newName: string): Promise<StudentID> {
    const newID = randomUUID();
    const newStudent: Student = { studentID: newID, studentName: newName };
    await this._transcripts.set(newID, { student: newStudent, grades: [] });
    return newID;
  }

  /**
   * Returns the transcript for a student
   *
   * @param id - a student ID
   * @returns the transcript for this student with this ID
   * @throws if the there is no transcript with the given student ID
   */
  async getTranscript(id: StudentID): Promise<Transcript> {
    const transcript = await this._transcripts.get(id);
    if (!transcript) throw new Error(`Transcript not found for student with ID ${id}`);
    return transcript;
  }

  /**
   * Adds a grade for a student
   *
   * @param id - a student ID
   * @param courseName - Name of the course
   * @param courseGrade - Student's grade in the course
   * @throws if the there is no transcript with the given student ID
   */
  async addGrade(id: StudentID, courseName: Course, courseGrade: number): Promise<void> {
    const transcript = await this._transcripts.get(id);
    if (!transcript) throw new Error(`Transcript not found for student with ID ${id}`);
    await this._transcripts.set(id, {
      ...transcript,
      grades: [...transcript.grades, { course: courseName, grade: courseGrade }],
    });
  }
}
