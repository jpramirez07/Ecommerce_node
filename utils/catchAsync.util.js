// funcion para "atrapar" errores, con esto, ya no es necesario usar try/catch
const catchAsync = (fn) => {
    //fn = function
    return (req, res, next) => {
      //recibe un callback ya que las rutas esperan una funcion
      fn(req, res, next).catch(next); //mando a llamar la funcion que estoy usando, se adapta; next => permite paso al sig middleware
    };
  };
  
  module.exports = { catchAsync };