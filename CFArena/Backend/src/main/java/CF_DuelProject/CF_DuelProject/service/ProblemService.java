package CF_DuelProject.CF_DuelProject.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

import CF_DuelProject.CF_DuelProject.model.Problem;

@Service
public class ProblemService {
    private FetchProblemService fetchProblemService;
    public ProblemService(FetchProblemService fetchProblemService) {
        this.fetchProblemService = fetchProblemService;
    }


    public List<String> getMatchProblems(String u1, String u2, int league) {
        Set<String> solved1 = fetchProblemService.fetchSolved(u1);
        Set<String> solved2 = fetchProblemService.fetchSolved(u2);

        Set<String> common = new HashSet<>(solved1);
        common.addAll(solved2);

        int base = 800 + (league - 1) * 100;
        List<Integer> ratings = List.of(
            Math.min(3500, Math.max(800, base)),
            Math.min(3500, Math.max(800, base + 100)),
            Math.min(3500, Math.max(800, base + 200)),
            Math.min(3500, Math.max(800, base + 300)),
            Math.min(3500, Math.max(800, base + 400))
        );
        List<String> result = new ArrayList<>();

        for (int r : ratings) {
            Problem p = pickProblem(r, common);
            if (p != null) {
                String id = p.getContestId() + "-" + p.getIndex();
                common.add(id);
                result.add("https://codeforces.com/contest/"+p.getContestId()+"/problem/"+p.getIndex());
            }
        }

        return result;
    }

    private Problem pickProblem(int rating, Set<String> solved) {
        List<Problem> list = fetchProblemService.getShuffledProblems(rating);
        for (Problem p : list) {
            String id = p.getContestId() + "-" + p.getIndex();

            if (!solved.contains(id)) {
                return p;
            }
        }
        return null;
    }
}