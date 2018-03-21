import chai from "chai";
import sinon from "sinon";
import EnchancedPromise from "../../src/task-7.js";

const assert = chai.assert;

describe("Task 7: some()", () => {
    beforeEach(() => {
        const fetchstub = sinon.stub(window, "fetch");
        
        fetchstub.withArgs("/test/200").resolves("0");
        fetchstub.withArgs("/test/200/1").resolves(new Promise(resolve => setTimeout(() => {
            resolve(1);
        }, 800)));
        fetchstub.withArgs("/test/200/2").resolves(new Promise(resolve => setTimeout(() => {
            resolve(2);
        }, 400)));
        fetchstub.withArgs("/test/200/3").resolves(Promise.resolve(3));
        fetchstub.withArgs("/test/200/4").resolves(Promise.resolve(4));
        fetchstub.withArgs("/test/200/5").resolves(Promise.resolve(5));
        fetchstub.withArgs("/test/200/6").resolves(Promise.resolve(6));
        fetchstub.withArgs("/test/200/7").resolves(Promise.resolve(7));
        fetchstub.rejects(new TypeError("Failed to fetch"));
    });

    afterEach(() => {
        window.fetch.restore();
    });

    function some(arr, count) {
        return EnchancedPromise.some(arr.map(window.fetch), count);
    }

    
    it("should return EnchansedPromise", () => {
        
        assert.instanceOf(some(["/test/200", "/test/20"], 1), EnchancedPromise);
    });

    it("should resolve with 2 url in right order", () => some(["/test/200/1", "/test/200/2", "/test/200/3"], 2)
        .then(data => {
            assert.deepEqual(data, [3, 2]);
        })
    );

    it("should resolve with 2 url", () => some(["/test/unexistent", "/test/200/4", "/test/500", "/test/200/5", "/test/501"], 2)
        .then(data => {
            assert.deepEqual(data, [4, 5]);
        })
    );

    it("should reject with failed to fullfill promise", () => some(["/test/unexistent", "/test/200/6", "/test/502", "/test/503"], 2)
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "failed to fullfill promise");
            }
        )
    );

    it("should reject when count is larger than length of array", () => some(["/test/200/7"], 2)
        .then(
            () => { throw new Error("was not supposed to succeed"); }
        )
        .catch(
            m => {
                assert.instanceOf(m, Error);
                assert.equal(m.message, "failed to fullfill promise");
            }
        )
    );

});
