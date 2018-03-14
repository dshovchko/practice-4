import chai from "chai";
import sinon from "sinon";
import getJson from "../../src/task-1.js";

const assert = chai.assert;

function jsonResult(obj) {
    return new window.Response(JSON.stringify(obj), {
        status: 200,
        headers: {
            "Content-type": "application/json"
        }
    });
}

function getResponse(scode) {
    return new window.Response("", {
        status: scode,
        headers: {
            "Content-type": "text/plain"
        }
    });
}

describe("Task 1: getJson", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");
        
        fetchstub.withArgs("/test/200").resolves(jsonResult({
            hello: "world",
            world: "hello"
        }));
        fetchstub.withArgs("/test/404").resolves(getResponse(404));
        fetchstub.withArgs("/test/500").resolves(getResponse(500));
        fetchstub.rejects(new TypeError("Failed to fetch"));
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it("should return Promise", () => {
        
        assert.instanceOf(getJson("/test/200"), Promise);
    });

    it("should correctly parse JSON response", () => {

        return getJson("/test/200")
            .then(data => {
                assert.equal(data.hello, "world");
                assert.equal(data.world, "hello");
            });
    });

    it("should correctly handle failed HTTP responses", () => {
        return getJson("/test/404")
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "Not Found");
                }
            );
    });

    it("should correctly handle failed HTTP responses", () => {
        return getJson("/test/500")
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "Internal Server Error");
                }
            );
    });

    it("should correctly handle failed to fetch", () => {
        return getJson("/test/car")
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, TypeError);
                    assert.equal(m.message, "Failed to fetch");
                }
            );
    });

});
