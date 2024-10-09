export default [
  {
    rules: {
      "new-cap": [
        "warn",
        {
          capIsNewExceptions: [
            "Given",
            "When",
            "Then",
            "BeforeAll",
            "Before",
            "AfterAll",
            "After",
          ],
        },
      ],
      "no-invalid-this": "off",
    },
  },
];
