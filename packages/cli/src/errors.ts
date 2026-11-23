/** An error the user can act on. The CLI prints its message without a stack trace. */
export class CliError extends Error {
  constructor(
    message: string,
    /** Optional next step, printed under the message. */
    readonly hint?: string,
  ) {
    super(message);
    this.name = "CliError";
  }
}
