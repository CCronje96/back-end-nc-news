const {
  convertTimestampToDate,
  formatFunc,
  formatArticles,
  createArticleLookup,
  formatComments,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("formatFunc", () => {
  test("returns an empty array if passed an empty array", () => {
    // Arrange
    const topicData = [];

    // Act
    const result = formatFunc(topicData);

    // Assert
    expect(result).toEqual([]);
  });
  test("returns a new array", () => {
    // Arrange
    const topicData = [{}];

    // Act
    const result = formatFunc(topicData);

    // Assert
    expect(topicData).not.toBe(result);
    expect(result).toBeInstanceOf(Array);
  });
  test("returned array has number of nested arrays matching number of input objects", () => {
    // Arrange
    const topicData = [{}, {}, {}];

    // Act
    const result = formatFunc(topicData);

    // Assert
    expect(result.length).toEqual(topicData.length);
  });
  test("returned nested arrays have expected elements", () => {
    // Arrange
    const topicData = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
        img_url: "",
      },
      {
        description: "Not dogs",
        slug: "cats",
        img_url: "",
      },
    ];

    // Act
    const result = formatFunc(topicData);

    // Assert
    expect(result[0]).toEqual(["The man, the Mitch, the legend", "mitch", ""]);
    expect(result[1]).toEqual(["Not dogs", "cats", ""]);
  });
  test("does not mutate the input array nor nested objects", () => {
    // Arrange
    const topicData = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
        img_url: "",
      },
    ];

    // Act
    formatFunc(topicData);

    // Assert
    expect(topicData).toEqual([
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
        img_url: "",
      },
    ]);
    expect(topicData[0]).toEqual({
      description: "The man, the Mitch, the legend",
      slug: "mitch",
      img_url: "",
    });
  });
});

describe("formatArticles", () => {
  test("returns an empty array if passed an empty array", () => {
    // Arrange
    const articleData = [];

    // Act
    const result = formatArticles(articleData);

    // Assert
    expect(result).toEqual([]);
  });
  test("returns a new array", () => {
    // Arrange
    const articleData = [{}];

    // Act
    const result = formatArticles(articleData);

    // Assert
    expect(articleData).not.toBe(result);
    expect(result).toBeInstanceOf(Array);
  });
  test("returned array has number of nested arrays matching number of input objects", () => {
    // Arrange
    const articleData = [{}, {}, {}];

    // Act
    const result = formatArticles(articleData);

    // Assert
    expect(result.length).toEqual(articleData.length);
  });
  test("returned nested arrays have expected elements", () => {
    // Arrange
    const articleData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1604394720000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const actual = [
      [
        "Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date("2020-07-09T21:11:00.000Z"),
        100,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      ],
      [
        "Eight pug gifs that remind me of mitch",
        "mitch",
        "icellusedkars",
        "some gifs",
        new Date("2020-11-03T09:12:00.000Z"),
        undefined,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      ],
    ];

    // Act
    const result = formatArticles(articleData);

    // Assert
    expect(result[0]).toEqual(actual[0]);
    expect(result[1]).toEqual(actual[1]);
  });
  test("does not mutate the input array nor nested objects", () => {
    // Arrange
    const articleData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    // Act
    formatArticles(articleData);

    // Assert
    expect(articleData).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ]);
    expect(articleData[0]).toEqual({
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });
});

describe("createArticleLookup", () => {
  test("returns an empty object when passed an empty array", () => {
    // Arrange
    const insertedArticles = [];

    // Act
    const result = createArticleLookup(insertedArticles);

    // Assert
    expect(result).toEqual({});
  });
  test("returns a lookup object for one article", () => {
    // Arrange
    const insertedArticles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date("2020-07-09T20:11:00.000Z"),
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    // Act
    const result = createArticleLookup(insertedArticles);

    // Assert
    expect(result).toEqual({ "Living in the shadow of a great man": 1 });
  });
  test("returns a lookup object for multiple articles", () => {
    // Arrange
    const insertedArticles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date("2020-07-09T20:11:00.000Z"),
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date("2020-11-03T09:12:00.000Z"),
        votes: null,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: new Date("2020-05-06T01:14:00.000Z"),
        votes: null,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    // Act
    const result = createArticleLookup(insertedArticles);

    // Assert
    expect(result).toEqual({
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 3,
      "Student SUES Mitch!": 4,
    });
  });
  test("does not mutate the input array nor nested objects", () => {
    // Arrange
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "Living in the shadow of a great man",
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        created_at: 1604113380000,
      },
      {
        article_title: "Living in the shadow of a great man",
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: "icellusedkars",
        created_at: 1583025180000,
      },
    ];

    const insertedArticles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date("2020-07-09T20:11:00.000Z"),
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 1591438200000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    // Act
    createArticleLookup(insertedArticles);
    formatComments(commentData, insertedArticles);

    // Assert
    expect(insertedArticles).toEqual([
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date("2020-07-09T20:11:00.000Z"),
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 1591438200000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ]);
    expect(insertedArticles[0]).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: new Date("2020-07-09T20:11:00.000Z"),
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });
});

describe("formatComments", () => {
  test("returns an empty array when passed an empty array", () => {
    // Arrange
    const commentData = [];
    const insertedArticles = [];

    // Act
    const result = formatComments(commentData, insertedArticles);

    // Assert
    expect(result).toEqual([]);
  });
  test("returned array has number of nested arrays matching number of input objects", () => {
    // Arrange
    const commentData = [{}, {}, {}];
    const insertedArticles = [];

    // Act
    const result = formatComments(commentData, insertedArticles);

    // Assert
    expect(result.length).toEqual(commentData.length);
  });
  test("returned array of nested arrays has expected elements, including article_id from insertedArticles (through articleLookup) key with expected value - single input", () => {
    // Arrange
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];

    const insertedArticles = [
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 1591438200000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    // Act
    const result = formatComments(commentData, insertedArticles);

    // Assert
    expect(result).toEqual([
      {
        article_id: 2,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: new Date("2020-04-06T13:17:00.000Z"),
      },
    ]);
  });
  test("returned array of nested arrays has expected elements, including article_id from insertedArticles (through articleLookup) key with expected value - multiple input", () => {
    // Arrange
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "Living in the shadow of a great man",
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        created_at: 1604113380000,
      },
    ];

    const insertedArticles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 1591438200000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    // Act
    const result = formatComments(commentData, insertedArticles);

    // Assert
    expect(result).toEqual([
      {
        article_id: 2,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: new Date("2020-04-06T13:17:00.000Z"),
      },
      {
        article_id: 1,
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        created_at: new Date("2020-10-31T03:03:00.000Z"),
      },
    ]);
  });
  test("does not mutate the input array nor nested objects", () => {
    // Arrange
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    const insertedArticles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    // Act
    formatComments(commentData, insertedArticles);

    // Assert
    expect(commentData).toEqual([
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ]);
    expect(commentData[0]).toEqual({
      article_title: "They're not exactly dogs, are they?",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 16,
      author: "butter_bridge",
      created_at: 1586179020000,
    });
  });
});
