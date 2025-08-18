import pytest
from src.main import app # Assuming 'app' is the Flask app instance

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_index_page(client):
    rv = client.get("/")
    assert rv.status_code == 200
    # Add more specific assertions based on expected content


