# Cancel photo search

- [x] Remove image search and all external search buttons; retain questionnaire scoring.
- [x] Verify the questionnaire still calculates the expected score.

# Age-based advice

- [x] Add the website user's age before all questions and a respectful bilingual recommendation in the check button.
- [x] Test strict age >70 and score >50 thresholds and verify the submitted questionnaire.

# High-risk veto

- [x] Add three bilingual veto questions and show high-risk results independently of the additive score.
- [x] Test each veto separately and verify high-risk and ordinary results in the questionnaire.

# Split the private-information veto

- [x] Replace the single "account passwords or unrelated private information" veto with two separate options: any account password, and any private ID document or personal information.
- [x] Test each new veto separately and verify both appear in the questionnaire.

# Private-location meetup advice

- [x] Add 「提出在私人場合面交」 below 「無法面交」 in Seller Behaviour with a copyable message asking to meet at a public place.
- [x] Test that the option adds 20%, stays capped at 40%, is not a veto, and keeps the exact Chinese message.

# Wider age-based advice

- [x] For users over 70, show the red advice message at the bottom of the page whenever the score is 30% or higher, or any critical warning sign is selected.
- [x] Test the exact 30% boundary, the veto-only case with a zero score, and that the age-70 boundary still stays silent.

# Advice for every selected item

- [x] Add bilingual handling advice and copyable replies for all profile, seller and critical-warning items after Check.
- [x] Verify complete coverage, selection changes, copying and unchanged scoring (49 tests; all 14 cards and bilingual clipboard contents checked in the page).

# Red warning text

- [x] Show each card's handling-advice warning line in red (both languages) so it reads as a warning.
- [x] Verify the warning renders red while the copyable reply keeps normal colors.

# Yellow-light wording

- [x] Reword the yellow band so it says 若要繼續交易，請多留意 instead of 可以繼續交易.
- [x] Verify the new bilingual message renders in the preview and tests still pass.

# Seller scoring weights

- [x] Raise each seller choice from 20% to 30% and the section cap from 40% to 70%.
- [x] Verify one choice shows 30%, three choices cap at 70%, and the section wording matches.

# Page titles

- [x] Set the main title to "Can I Trust This Person? 這人可信嗎" and the subtitle to "Check if a Facebook Marketplace buyer might be a fake account. 二手交易詐騙檢測", English first.
- [x] Verify both render in the page and the browser tab title matches.