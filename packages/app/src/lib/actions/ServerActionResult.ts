export type ServerActionResult<T> =
	| ({
			success: true
	  } & T)
	| { success: false; message?: string }
