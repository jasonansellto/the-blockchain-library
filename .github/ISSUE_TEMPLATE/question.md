---
name: Question
description: Ask a question about the repository, documentation, or contribution process
title: "[Question]: "
labels: ["question"]
body:
  - type: textarea
    id: question
    attributes:
      label: Your question
      description: Explain what you are trying to understand or accomplish.
    validations:
      required: true
  - type: textarea
    id: tried
    attributes:
      label: What have you already checked?
      description: Link to relevant documentation or describe the steps already attempted.
  - type: checkboxes
    id: scope
    attributes:
      label: Scope confirmation
      options:
        - label: This question is about the repository, documentation, or project contribution process—not personalized financial or investment advice.
          required: true
