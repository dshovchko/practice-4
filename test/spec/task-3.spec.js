import chai from "chai";
import sinon from "sinon";
import getSeries from "../../src/task-3.js";

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

describe("Task 3: getSeries", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");
        
        fetchstub.withArgs("/test/200/1").resolves(jsonResult({
            hello: "world",
            world: "hello"
        }));
        fetchstub.withArgs("/test/200/2").resolves(jsonResult({
            hello: "wollo",
            world: "herld"
        }));
        fetchstub.withArgs("/test/404").resolves(getResponse(404));
        fetchstub.withArgs("/test/500").resolves(getResponse(500));
        fetchstub.rejects(new TypeError("Failed to fetch"));
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it("should return Promise", () => {
        
        assert.instanceOf(getSeries("/test/200/1", "/test/200/2"), Promise);
    });

    it("should correctly get", () => {

        return getSeries("/test/200/1", "/test/200/2")
            .then(data => {
                assert.deepEqual(data, [{ hello: "world", world: "hello" }, { hello: "wollo", world: "herld" }]);
            });
    });

    it("should failed get article", () => {

        return getSeries("/test/article", "/test/200/2")
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "article fetch failed");
                }
            );
    });

    it("should failed get comments", () => {

        return getSeries("/test/200/1", "/test/comments")
            .then(
                () => { throw new Error("was not supposed to succeed"); },
                m => {
                    assert.instanceOf(m, Error);
                    assert.equal(m.message, "comments fetch failed");
                }
            );
    });
});
