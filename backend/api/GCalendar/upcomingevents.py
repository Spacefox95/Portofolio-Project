from flask import Flask, Blueprint, jsonify
import datetime
import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Blueprint for calendar routes
calendar_routes = Blueprint('calendar_routes', __name__)

# OAuth configuration constants
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
REDIRECT_URI = 'http://localhost:8080/'

@calendar_routes.route('/events')
def get_upcoming_events():
    creds = None
    credentials_file = os.path.join(os.path.dirname(__file__), 'credentials.json')

    # Check if token.json exists and load credentials
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If no valid credentials available, initiate OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                credentials_file, SCOPES, redirect_uri=REDIRECT_URI
            )
            creds = flow.run_local_server(port=8080)

        # Save credentials to token.json for future use
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        # Build the Calendar API service
        service = build("calendar", "v3", credentials=creds)

        # Fetch upcoming events from the user's primary calendar
        now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
        events_result = service.events().list(
            calendarId="primary",
            timeMin=now,
            maxResults=10,
            singleEvents=True,
            orderBy="startTime",
        ).execute()

        # Extract events from API response
        events = events_result.get("items", [])

        # Return events as JSON response
        if not events:
            return jsonify({"message": "No upcoming events found."})
        else:
            return jsonify(events)

    except HttpError as error:
        # Handle API errors and return JSON response
        return jsonify({"error": str(error)}), 500

# Initialize Flask app and register blueprint
app = Flask(__name__)
app.register_blueprint(calendar_routes)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
