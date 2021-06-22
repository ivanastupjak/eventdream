'use strict'

const Helpers = use('Helpers')
const Event = use('App/Models/Event');
const {validate, sanitize} = use("Validator")
const Moment = use('moment')
const Poster = use('poster')


class EventController {

  async addEvent({request, response, organisation}) {

    const allParams = request.post()

    const validation = await validate(allParams, {
      name: "required|max:60",
      description: "max:1000",
      place_of_event: "required|max:50",
      start_of_event: "required",
      end_of_event: "required"
    })

    if (validation.fails()) {
      return response.badRequest("Invalid params")
    }

    const eventPoster = request.file("event_poster", {
      types: ["image"],
      size: "2mb"
    })

    if (!eventPoster) {
      return response.badRequest("Invalid image")
    }

    const pictureName = `${Moment().format("YYYY-MM-DD-HH-mm-ss")}.jpg`
    await eventPoster.move(Helpers.publicPath("/resources/media"), {
      name: `${pictureName}`
    })

    if (!eventPoster.moved()) {
      return eventPoster.error()
    }

    const event = await Event.create({
      name: allParams.name,
      description: allParams.description,
      place_of_event: allParams.place_of_event,
      start_of_event: allParams.start_of_event,
      end_of_event: allParams.end_of_event,
      organisation_id: organisation.id
    })

    if (!event) {
      return response.badRequest("Couldn't create event")
    }

    await Poster.create({
      path: `resources/media/${pictureName}`,
      event_id: event.id
    })

    return response.ok()
  }

  async editEvent({request, response, organisation, params}) {

    const allParams = request.post()

    const validation = await validate(allParams, {
      name: "required|max:60",
      description: "max:1000",
      place_of_event: "required|max:50",
      start_of_event: "required",
      end_of_event: "required"
    })

    if (validation.fails()) {
      return response.badRequest("Invalid params")
    }

    const event = await Event.query()
      .whereHas("organisation", (query) => {
        query.where('organisations.id', organisation.id)
      }).where('id', params.event_id).with('poster').first()

    if (!event) {
      return response.notFound({
        _message: "Event does not exist"
      })
    }

    const eventPoster = request.file("event_poster", {
      types: ["image"],
      size: "2mb"
    })

    if (eventPoster) {
      const pictureName = `${Moment().format("YYYY-MM-DD-HH-mm-ss")}.jpg`
      await eventPoster.move(Helpers.publicPath("/resources/media"), {
        name: `${pictureName}`
      })


    }


  }

}

module.exports = EventController
