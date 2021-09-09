'use strict'

const Helpers = use('Helpers')
const Event = use('App/Models/Event');
const {validate, sanitize} = use("Validator")
const Moment = use('moment')
const Poster = use('App/Models/Poster')
const fs = use('fs')


class EventController {

  async addEvent({request, response, organisation}) {

    const allParams = request.post()

    const validation = await validate(allParams, {
      name: "required|max:60",
      description: "max:1000",
      place_of_event: "required|max:50",
      city: "required|max:20",
      start_of_event: "required|date",
      end_of_event: "required|date"
    })

    if (validation.fails()) {
      return response.badRequest("Invalid params")
    }

    const eventPoster = request.file("event_poster", {
      types: ["image"],
      extnames:['png','jpg'],
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
      city: allParams.city,
      start_of_event: new Date(allParams.start_of_event),
      end_of_event: new Date(allParams.end_of_event),
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
      city: "required|max:20",
      start_of_event: "required|date",
      end_of_event: "required|date"
    })

    if (validation.fails()) {
      return response.badRequest("Invalid params")
    }

    const event = await Event
      .query()
      .where('events.id', params.event_id)
      .whereHas("organisation", (query) => {
        query.where('organisations.id', organisation.id)
      })
      .with('poster').first()

    if (!event) {
      return response.notFound({
        _message: "Event does not exist"
      })
    }

    const eventPoster = request.file("event_poster", {
      types: ["image"],
      size: "2mb"
    })

    let pictureName
    if (eventPoster) {
      pictureName = `${Moment().format("YYYY-MM-DD-HH-mm-ss")}.jpg`
      await eventPoster.move(Helpers.publicPath("/resources/media"), {
        name: `${pictureName}`
      })
    }

    if (!eventPoster.moved()) {
      return eventPoster.error()
    }

    fs.unlink(`./public/${event.$relations.poster.path}`, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        console.log('successfully deleted local image');
      }
    })

    const poster = await Poster.query().where("event_id", event.id).first()

    poster.merge({
      path: `resources/media/${pictureName}`
    })
    poster.save()


    event.merge({
      name: allParams.name,
      description: allParams.description,
      place_of_event: allParams.place_of_event,
      city: allParams.city,
      start_of_event: new Date(allParams.start_of_event),
      end_of_event: new Date(allParams.end_of_event),
      organisation_id: organisation.id
    })
    await event.save()

  }

  async deleteEvent({response, params, organisation}) {

    const event = await Event.query().where("events.id", params.event_id)
      .whereHas("organisations", (b) => {
        b.where("organisations.id", organisation.id)
      })
      .first()

    if (!event) {
      return response.notFound({
        _message: "Event does not exist"
      })
    }

    event.delete()

    return response.ok()
  }

  async getEvents({request, response}) {
    const queryParams = request.only(['page', 'limit', 'search','searchType'])

    let events = Event
      .query()
      .with('poster')
      .with('organisations')

    if (queryParams.search && queryParams.search !== "") {
      if(queryParams.searchType === 'Organizacija'){
        events.whereHas('organisations',(query)=>{
          query.where('organisation_name','LIKE',`%${queryParams.search}%`)
        })
      }else if(queryParams.searchType === 'Grad'){
        events.where('city','LIKE',`%${queryParams.search}%`)
      }else{
        events.where('name', 'LIKE', `%${queryParams.search}%`)
      }
    }

    events = await events.orderBy('created_at', 'desc').paginable(queryParams.page, queryParams.limit)

    return response.ok(events)
  }

  async getSingleEvent({response, params}) {

    const events = await Event
      .query()
      .where('id', params.event_id)
      .with('organisations')
      .with('poster')
      .with('comments')
      .firstOrFail()

    return response.ok(events)
  }

  async getEventsOfOrganisation({response, params}) {

    let events = await Event
      .query()
      .where('organisation_id', params.organisation_id)
      .with('organisations')
      .with('poster')
      .orderBy('created_at', 'desc')
      .paginable(params.page, params.limit)


    return response.ok(events)
  }

  async getFollowingOrganisationsEvents({request,response,user}){

    const allParams = request.only(['page','limit'])
    const events = await Event
      .query()
      .whereHas('organisations',(query)=>{
        query.whereHas('followers',(query)=>{
          query.where('users.id',user.id)
        })
      })
      .with('poster')
      .with('organisations')
      .paginable(allParams)

    return response.ok(events)
  }

  async commentEvent({request,response,user,params}){

    const allParams = request.only(['comment'])

    const validation = await validate(allParams,{
      comment:'required|min:1'
    })

    if(validation.fails()){
      return response.badRequest()
    }

    const event = await Event
      .query()
      .where('id',params.event_id)
      .first()

    if(!event){
      return response.badRequest()
    }

    await event.comments().create({user_id: user.id, comment: allParams.comment})

    return response.ok()
  }

}

module.exports = EventController
