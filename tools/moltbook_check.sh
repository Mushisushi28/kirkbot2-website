#!/bin/bash
# Moltbook Status Checker using curl

echo "🦞 Moltbook Status Check - $(date -Iseconds)"

# Check for API key in environment
API_KEY="${MOLTBOOK_API_KEY:-${MOLTBOOK_AGENT_KEY:-}}"

if [ -z "$API_KEY" ]; then
    echo "❌ No Moltbook API key found"
    echo "To set up:"
    echo "1. Get your API key from Moltbook"
    echo "2. Set environment variable: export MOLTBOOK_API_KEY=your_key_here"
    echo "3. Or add it to your system environment"
    exit 0
fi

MOLTBOOK_API_BASE="https://www.moltbook.com/api/v1"

echo ""
echo "📋 Checking claim status..."

# Check claim status
STATUS_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $API_KEY" \
    "$MOLTBOOK_API_BASE/agents/status")

HTTP_CODE=$(echo "$STATUS_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$STATUS_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    CLAIM_STATUS=$(echo "$RESPONSE_BODY" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "📊 Claim status: $CLAIM_STATUS"
    
    case "$CLAIM_STATUS" in
        "pending_claim")
            echo "⚠️  PENDING CLAIM - You need to claim your agent!"
            echo "   Ask your human to visit the claim URL"
            ;;
        "claimed")
            echo "✅ CLAIMED - Agent is properly set up"
            ;;
        *)
            echo "❓ Unknown status: $CLAIM_STATUS"
            ;;
    esac
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ API key invalid or unauthorized"
else
    echo "❌ Status check failed: HTTP $HTTP_CODE"
    if [ -n "$RESPONSE_BODY" ]; then
        echo "   Response: $RESPONSE_BODY"
    fi
fi

echo ""
echo "💬 Checking DMs..."

# Check DMs
DM_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $API_KEY" \
    "$MOLTBOOK_API_BASE/agents/dm/check")

DM_HTTP_CODE=$(echo "$DM_RESPONSE" | tail -n1)
DM_BODY=$(echo "$DM_RESPONSE" | head -n -1)

if [ "$DM_HTTP_CODE" = "200" ]; then
    PENDING=$(echo "$DM_BODY" | grep -o '"pending_requests":[0-9]*' | cut -d':' -f2)
    UNREAD=$(echo "$DM_BODY" | grep -o '"unread_messages":[0-9]*' | cut -d':' -f2)
    
    if [ -n "$PENDING" ] && [ "$PENDING" -gt 0 ]; then
        echo "📥 $PENDING pending DM request(s) - needs approval!"
    else
        echo "📥 No pending DM requests"
    fi
    
    if [ -n "$UNREAD" ] && [ "$UNREAD" -gt 0 ]; then
        echo "📨 $UNREAD unread message(s)"
    else
        echo "📨 No unread messages"
    fi
else
    echo "❌ DM check failed: HTTP $DM_HTTP_CODE"
fi

echo ""
echo "✨ Check complete at $(date -Iseconds)"