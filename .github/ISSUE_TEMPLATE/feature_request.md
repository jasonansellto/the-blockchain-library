---
name: Feature request
description: Suggest a documentation, platform, integration, or developer-experience improvement
title: "[Feature]: "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: Thanks for helping improve The Blockchain Library.
  - type: textarea
    id: problem
    attributes:
      label: Problem or opportunity
      description: What learner, educator, developer, or platform need would this address?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposed solution
      description: Describe the feature or improvement you would like to see.
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Project area
      options:
        - Educational content
        - Documentation
        - ChatGPT app
        - MCP server
        - Developer examples
        - Website or accessibility
        - Community workflow
        - Other
    validations:
      required: true
  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Add examples, references, screenshots, or implementation ideas.
