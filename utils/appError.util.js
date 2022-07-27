class AppError extends Error {
    //extends (aplica herencia) Error = adquiere las propiedades de Error (clase nativa de JS)
    constructor(statusCode, message) {
      super(); //llama al superconstructor -> permite incluir TODAS las propiedades
      this.statusCode = statusCode;
      this.message = message;
      this.status = `${statusCode}`.startsWith("4") ? "error" : "fail";
      // stack error ( pila de errores )
      Error.captureStackTrace(this, this.constructor); //adjuanta todos los errores y los pone en el mensaje de error (facilita entendimiento de errores, debug)
      // 1er argumento : a que le quiero adjuntar esta clase; 2do argumento: constructor al que quiero adjuntar
    }
  }
  
  module.exports = { AppError };