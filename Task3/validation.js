export function validateTodo(req, res, next) {
  const { title, completed } = req.body;
  if (typeof title !== "string" || title.trim() === "" || title.length > 200) {
    return res.status(400).json({
      error: { message: "Invalid title", code: "VALIDATION_ERROR" }
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      error: { message: "Invalid completed value", code: "VALIDATION_ERROR" }
    });
  }

  next();
}
