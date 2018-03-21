import chai from "chai";
import sinon from "sinon";
import { getResponse, jsonResult } from "./utils.js";
import { status, json, getJSON } from "../../src/task-1.js";

const assert = chai.assert;

const json1 = { hello: "world", world: "hello" };

describe("Task 1: status", () => {
    it("should return window.Response", () => {
        
        assert.instanceOf(status(getResponse(200)), window.Response);
    });

    it("should return Response", () => {
        
        assert.instanceOf(status(getResponse(200)), window.Response);
    });

    it("should correctly pass HTTP responses (200-299)", () => {

        let r = getResponse(200);
        assert.equal(status(r), r);

        r = getResponse(226);
        assert.equal(status(r), r);

        r = getResponse(299);
        assert.equal(status(r), r);
    });

    it("should throw error on another HTTP responses", () => {

        assert.throws(() => status(getResponse(307)), Error, "Temporary Redirect");
        assert.throws(() => status(getResponse(404)), Error, "Not Found");
        assert.throws(() => status(getResponse(503)), Error, "Service Unavailable");
    });

});

describe("Task 1: json", () => {
    it("should correctly parse JSON response", () => json(jsonResult(json1))
        .then(data => {
            assert.equal(data.hello, "world");
            assert.equal(data.world, "hello");
        })
    );
});

describe("Task 1: getJSON", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");
        
        fetchstub.withArgs("/test/200").resolves(jsonResult(json1));
        fetchstub.withArgs("/test/404").resolves(getResponse(404));
        fetchstub.withArgs("/test/500").resolves(getResponse(500));
        fetchstub.rejects(new TypeError("Failed to fetch"));
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it("should return Promise", () => {
        
        assert.instanceOf(getJSON("/test/200"), Promise);
    });

    it("should correctly parse JSON response", () => getJSON("/test/200")
        .then(data => {
            assert.equal(data.hello, "world");
            assert.equal(data.world, "hello");
        })
    );

    it("should correctly handle failed HTTP responses", () => getJSON("/test/404")
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "Not Found");
            }
        )
    );

    it("should correctly handle failed HTTP responses", () => getJSON("/test/500")
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "Internal Server Error");
            }
        )
    );

    it("should correctly handle failed to fetch", () => getJSON("/test/car")
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, TypeError);
                assert.equal(m.message, "Failed to fetch");
            }
        )
    );

});
