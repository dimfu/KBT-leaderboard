package data

type SendNotificationRequest struct {
	Message string `json:"message"`
}

type SendNotificationResponse struct {
	Message string `json:"message"`
}
