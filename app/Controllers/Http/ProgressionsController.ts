import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HistoryService from 'App/Services/HistoryService'
import HistoryValidator from 'App/Validators/HistoryValidator'

export default class ProgressionsController {
  public async toggle({ request, view, auth, route }: HttpContextContract) {
    const data = await request.validate(HistoryValidator)
    const userProgression = await HistoryService.toggleComplete(auth, route?.name, data)

    return view.render('components/fragments/complete', { userProgression })
  }
}
