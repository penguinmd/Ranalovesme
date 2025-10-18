#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "=== Testing RanaLovesMe API ==="
echo

# Get token from registration
echo "1. Testing User Login..."
RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"testuser","password":"testpass123"}')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  echo "$RESPONSE" | python3 -m json.tool
  exit 1
fi

echo "Login successful! Token obtained."
echo

# Test Days endpoint
echo "2. Testing Days - Create..."
curl -s -X POST $BASE_URL/days \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"date":"2025-10-18","title":"Our First Day","description":"Amazing time together","mood":"happy","rating":5}' \
  | python3 -m json.tool
echo

echo "3. Testing Days - List..."
curl -s $BASE_URL/days \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
echo

# Test Places endpoint
echo "4. Testing Places - Create..."
curl -s -X POST $BASE_URL/places \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Central Park","address":"New York, NY","latitude":40.785091,"longitude":-73.968285,"category":"park","visit_date":"2025-10-18","notes":"Beautiful walk together"}' \
  | python3 -m json.tool
echo

echo "5. Testing Places - List..."
curl -s $BASE_URL/places \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
echo

# Test Music endpoint
echo "6. Testing Music - Create..."
curl -s -X POST $BASE_URL/music \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"song","name":"Our Song","artist":"Test Artist","spotify_uri":"spotify:track:123","date":"2025-10-18","notes":"This reminds me of you"}' \
  | python3 -m json.tool
echo

# Test Activities endpoint
echo "7. Testing Activities - Create..."
curl -s -X POST $BASE_URL/activities \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Dinner at Italian Restaurant","description":"Had the best pasta","category":"dining","date":"2025-10-18"}' \
  | python3 -m json.tool
echo

echo "=== All tests complete ==="
