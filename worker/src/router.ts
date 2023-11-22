import { Router, error, json } from "itty-router"

const router = Router()

router
	.get('/', () => json({ message: 'OK!', status: 200 }))
	.all('*', () => error(404))

export default router