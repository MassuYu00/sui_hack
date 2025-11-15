#!/bin/bash

# Japanese to English translation mappings
declare -A translations=(
    # UI General
    ["選手"]="Fighter"
    ["投資"]="Investment"
    ["スカウト"]="Scout"
    ["提案"]="Proposal"
    ["ダッシュボード"]="Dashboard"
    ["推薦"]="Recommendation"
    ["応援"]="Support"
    ["修行"]="Training"
    ["資金調達"]="Fundraising"
    ["投資家"]="Investor"
    ["才能"]="Talent"
    
    # Actions
    ["投資する"]="Invest"
    ["応援する"]="Support"
    ["推薦する"]="Recommend"
    ["承認"]="Approve"
    ["却下"]="Reject"
    ["送信"]="Submit"
    ["キャンセル"]="Cancel"
    ["閉じる"]="Close"
    ["確認"]="Confirm"
    
    # Status
    ["審査待ち"]="Pending Review"
    ["承認済み"]="Approved"
    ["却下済み"]="Rejected"
    ["資金調達中"]="Fundraising"
    ["修行中"]="In Training"
    ["活動中"]="Active"
    
    # Fields
    ["選手名"]="Fighter Name"
    ["階級"]="Weight Class"
    ["国籍"]="Nationality"
    ["戦績"]="Record"
    ["理由"]="Reason"
    ["金額"]="Amount"
    ["報酬"]="Reward"
    
    # Phrases
    ["有望な選手"]="Promising Fighter"
    ["資金調達目標"]="Fundraising Goal"
    ["調達額"]="Raised Amount"
    ["投資額"]="Investment Amount"
    ["持分"]="Share"
    ["配分"]="Distribution"
)

echo "This is a placeholder script. Manual translation is recommended for better quality."
echo "Total translation pairs: ${#translations[@]}"
