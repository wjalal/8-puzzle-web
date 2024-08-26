#include <iostream>
#include <queue>
#include <stack>
#include <set>
#include <algorithm>
#include <cstring>

using namespace std;

bool verbose = false;

class Board {

    int N,*grid, g_cost, h_cost, priority, z_id;

    Board *left_neighbour, *right_neighbour, *top_neighbour, *bottom_neighbour, *prev;

    int get_inversions() {
        int inv = 0;
        for (int i=0; i<N*N; i++) 
            for (int j=i+1; j<N*N; j++) 
                if (grid[j] != 0 && grid[i] > grid[j]) inv++; 
        return inv;
    };

    public:
    
    Board (int N) {
        this->N = N, this->g_cost = 0, this->h_cost = -1;
        grid = new int[N*N];
        left_neighbour = right_neighbour = top_neighbour = bottom_neighbour = prev = nullptr;
    };

    void set_values (int* grid) {
        for (int i=0; i < N*N; i++) {
            this->grid[i] = grid[i];
            if (this->grid[i] == 0) z_id = i;
        };
        //cout << "data copied into board" << endl;
    };

    void print() {
        cout << "\t\t[";
        for (int i=0; i < N*N; i++) {
            cout << grid[i];
            if (i < N*N-1) cout << ",";
            // if (i%N == N-1) cout << endl;
        };
        cout << "]";
    };

    void set_left_neighbour (Board* neighbour) {
        this->left_neighbour = neighbour;
    };

    void set_right_neighbour (Board* neighbour) {
        this->right_neighbour = neighbour;
    };

    void set_top_neighbour (Board* neighbour) {
        this->top_neighbour = neighbour;
    };

    void set_bottom_neighbour (Board* neighbour) {
        this->bottom_neighbour = neighbour;
    };

    void set_prev (Board* prev) {
        this->prev = prev;
    };

    Board* get_prev() {
        return this->prev;
    };

    void swap_left() {
        this->grid[z_id] = this->grid[z_id-1];
        this->grid[z_id-1] = 0;
        this->z_id--;
    };

    Board* get_left_neighbour() {
        if (z_id % N == 0) return nullptr;
        if (left_neighbour) return left_neighbour;
        //cout << "making left neighbour" << endl;
        this->left_neighbour = new Board (this->N);
        this->left_neighbour->set_values (this->grid);
        this->left_neighbour->swap_left();
        this->left_neighbour->set_right_neighbour(this);
        this->left_neighbour->set_prev(this);
        this->left_neighbour->set_g_cost (this->g_cost + 1);
        return this->left_neighbour;
    };

    void swap_right() {
        this->grid[z_id] = this->grid[z_id+1];
        this->grid[z_id+1] = 0;
        this->z_id++;
    };

    Board* get_right_neighbour() {
        if (z_id % N == N-1) return nullptr;
        if (right_neighbour) return right_neighbour;
        //cout << "making right neighbour" << endl;
        this->right_neighbour = new Board (this->N);
        this->right_neighbour->set_values (this->grid);
        this->right_neighbour->swap_right();
        this->right_neighbour->set_left_neighbour(this);
        this->right_neighbour->set_prev(this);
        this->right_neighbour->set_g_cost (this->g_cost + 1);
        return this->right_neighbour;
    };

    void swap_top() {
        this->grid[z_id] = this->grid[z_id-N];
        this->grid[z_id-N] = 0;
        this->z_id -= N;
    };

    Board* get_top_neighbour() {
        if (z_id < N) return nullptr;
        if (top_neighbour) return top_neighbour;
        //cout << "making top neighbour" << endl;
        this->top_neighbour = new Board (this->N);
        this->top_neighbour->set_values (this->grid);
        this->top_neighbour->swap_top();
        this->top_neighbour->set_bottom_neighbour(this);
        this->top_neighbour->set_prev(this);
        this->top_neighbour->set_g_cost (this->g_cost + 1);
        return this->top_neighbour;
    };

    void swap_bottom() {
        this->grid[z_id] = this->grid[z_id+N];
        this->grid[z_id+N] = 0;
        this->z_id += N;
    };

    Board* get_bottom_neighbour() {
        if (z_id >= N*N - N) return nullptr;
        if (bottom_neighbour) return bottom_neighbour;
        //cout << "making bottom neighbour" << endl;
        this->bottom_neighbour = new Board (this->N);
        this->bottom_neighbour->set_values (this->grid);
        this->bottom_neighbour->swap_bottom();
        this->bottom_neighbour->set_top_neighbour(this);
        this->bottom_neighbour->set_prev(this);
        this->bottom_neighbour->set_g_cost (this->g_cost + 1);
        return this->bottom_neighbour;
    };

    int manhattan_distance() {
        int total = 0;
        for (int i=0; i<N*N; i++) {
            int row = i/N, col = i%N, g_row = row, g_col = col;
            if (grid[i] != 0) g_row = (grid[i]-1)/N, g_col = (grid[i]-1)%N;
            total += (abs(g_row - row) + abs(g_col - col));
        };
        return total;
    };

    int get_g_cost() {
        return g_cost;
    };

    void set_g_cost (int g_cost) {
        this->g_cost = g_cost;
    };

    int get_h_cost() {
        if (h_cost == -1) h_cost = manhattan_distance();
        return h_cost; 
    };

    int get_priority() {
        return get_g_cost() + get_h_cost();
    };

    void a_star_search();
};

class h_comparator {
    public:
    int operator() (Board* b1, Board* b2) {
        return b1->get_priority() > b2->get_priority();
    };
};

void Board::a_star_search() {
    int inv = get_inversions();
    if (verbose) cout << "inv = " << inv << endl;
    if (N % 2) {
        if (inv % 2) {
            cout << "JSON\n{\n\t\"solvable\": false \n}" << endl;
            return;
        };
    } else {
        if ( !((z_id/N)%2) && !(inv%2)  ||  (z_id/N)%2 && inv%2 ) {
            cout << "JSON\n{\n\t\"solvable\": false \n}" << endl;
            return;
        };
    };

    priority_queue <Board*, vector<Board*>, h_comparator > pq;
    set<Board*> c_list;
    pq.push (this);
    Board *search = this, *tail;
    int deq_exp = 0, moves = 0;
    while (search->get_h_cost() != 0) {
        search = pq.top();
        c_list.insert(search);
        pq.pop();
        if (verbose) {
            search->print();
            cout << "g=" << search->get_g_cost() << ", h=" << search->get_h_cost() << endl;
        };
        if (search->get_left_neighbour() && !c_list.count(search->get_left_neighbour()))
            pq.push(search->get_left_neighbour());
        if (search->get_right_neighbour() && !c_list.count(search->get_right_neighbour()))
            pq.push(search->get_right_neighbour());
        if (search->get_top_neighbour() && !c_list.count(search->get_top_neighbour()))
            pq.push(search->get_top_neighbour());
        if (search->get_bottom_neighbour() && !c_list.count(search->get_bottom_neighbour()))
            pq.push(search->get_bottom_neighbour());
        deq_exp++;
        if (verbose) cout << "deq_exp: " << deq_exp << endl;
    };
    tail = search;
    stack<Board*> path;
    while (tail) {
        moves++;
        path.push (tail);
        tail = tail->get_prev();
    };

    cout << "JSON" << endl;
    cout << "{\n\t\"solvable\": true,\n\t\"nMoves\": " << moves-1 << ",\n\t\"moves\": [ " << endl;
    while (!path.empty()) {
        path.top()->print(), path.pop();
        if (!path.empty()) cout << ",";
        cout << endl;
    }
    cout << "\t]\n}" << endl;
};

int main (int argc, char** argv) {

    int N; 
    cin >> N;

    int* grid = new int[N*N];
    for (int i=0; i<N*N; i++) {
        cin >> grid[i];
    };

    Board* b = new Board(N);
    b->set_values(grid);
    b->a_star_search();

    return 0;
};