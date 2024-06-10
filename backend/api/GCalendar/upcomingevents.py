from flask import Blueprint, redirect, session, url_for, request, jsonify
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import datetime
import google.auth.transport.requests
import google.oauth2.credentials

calendar_routes = Blueprint('calendar_routes', __name__)

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
REDIRECT_URI = 'http://localhost:5000/oauth2callback'  # This should be static and registered

# Only in development environment
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

@calendar_routes.route('/authorize')
def authorize():
    """Step 1: User Authorization."""
    credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    flow = InstalledAppFlow.from_client_secrets_file(
        credentials_path, SCOPES)
    flow.redirect_uri = REDIRECT_URI  # Set the redirect URI
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true')
    session['state'] = state
    return redirect(authorization_url)

@calendar_routes.route('/oauth2callback')
def oauth2callback():
    """Step 2: OAuth2 Callback."""
    credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    state = session.get('state')
    flow = InstalledAppFlow.from_client_secrets_file(
        credentials_path, SCOPES, state=state)
    flow.redirect_uri = REDIRECT_URI  # Set the redirect URI
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)

    return redirect(url_for('calendar_routes.get_upcoming_events'))

@calendar_routes.route('/events', methods=['GET'])
def get_upcoming_events():
    """Step 3: Fetch events."""
    if 'credentials' not in session:
        return redirect(url_for('calendar_routes.authorize'))

    credentials = google.oauth2.credentials.Credentials(**session['credentials'])
    if not credentials or not credentials.token:
        return redirect(url_for('calendar_routes.authorize'))

    try:
        service = build("calendar", "v3", credentials=credentials)
        now = datetime.datetime.utcnow().isoformat() + "Z"
        events_result = service.events().list(
            calendarId="primary",
            timeMin=now,
            maxResults=10,
            singleEvents=True,
            orderBy="startTime"
        ).execute()
        events = events_result.get("items", [])

        return jsonify(events)
    except HttpError as error:
        return jsonify({"error": str(error)}), 500

def credentials_to_dict(credentials):
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
