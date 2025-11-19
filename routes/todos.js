const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// Obtener todos los todos
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    console.error('Error al obtener todos:', error);
    res.status(500).json({ error: 'Error al obtener los todos' });
  }
});

// Crear nuevo
router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;
    console.log('POST /todos body:', req.body);
    const newTodo = new Todo({
      title,
      userId: req.user.id
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    console.error('Error al crear todo:', error);
    res.status(500).json({ error: 'Error al crear el todo' });
  }
});

// Actualizar (title y/o completed)
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('PUT /todos/:id params:', req.params.id);
    console.log('PUT /todos/:id body:', req.body);

    const updateFields = {};
    if (req.body.title !== undefined) {
      updateFields.title = req.body.title;
    }
    if (req.body.completed !== undefined) {
      updateFields.completed = req.body.completed;
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateFields,
      { new: true }
    );

    if (!updatedTodo) {
      console.log('No se encontró el todo para actualizar');
      return res.status(404).json({ error: 'Todo no encontrado' });
    }

    console.log('Todo actualizado:', updatedTodo);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error al actualizar todo:', error);
    res.status(500).json({ error: 'Error al actualizar el todo' });
  }
});

// Eliminar
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedTodo) return res.status(404).json({ error: 'Todo no encontrado' });
    res.json({ message: 'Todo eliminado' });
  } catch (error) {
    console.error('Error al eliminar todo:', error);
    res.status(500).json({ error: 'Error al eliminar el todo' });
  }
});

module.exports = router;
