const knex = require("../database/knex")

class notesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body
    const { user_id } = request.params

    const [note_id] = await knex("movies_notes").insert({
        title,
        description,
        rating,
        user_id
    })

    const tagsInsert = tags.map( name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("movies_tags").insert(tagsInsert)
    
    response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex("movies_notes").where({ id }).first()
    const tags = await knex("movies_tags").where({ note_id: id }).orderBy("name")

    return response.json({
      ...note,
      tags
    })
  }

  async delete(request, response) {
    const { id } = request.params
    
    await knex("movies_notes").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query

    let notes;

    if (tags) {
      
      const filterTags = tags.split(",").map(tag => tag.trim())

      notes = await knex("movies_tags").select(["movies_notes.id","movies_notes.title","movies_tags.note_id"]).where("movies_notes.user_id", user_id).whereLike("movies_notes.title", `%${title}%`).whereIn("name", filterTags).innerJoin("movies_notes", "movies_notes.id", "movies_tags.note_id")                                                                          

    } else {
      notes = await knex("movies_notes").whereLike("title", `%${title}%`).where({ user_id }).orderBy("title")
    }

    const userTags = await knex("movies_tags").where({ user_id })
    const notesWithTags = notes.map( note => {
      const noteTags = userTags.filter( tag => tag.note_id === note.id)

      return {
        ...notes,
        tags: noteTags 
      }
    })



    return response.json(notesWithTags)
  }
}

module.exports = notesController