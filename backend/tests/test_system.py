from fastapi.testclient import TestClient
from main import app


def test_health_and_readiness() -> None:
    with TestClient(app) as client:
        assert client.get("/health").json() == {"status": "ok"}
        assert client.get("/ready").json() == {"status": "ready"}
