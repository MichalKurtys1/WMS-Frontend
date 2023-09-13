import { useNavigate } from "react-router";

import style from "./DocumentsPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { BsSortAlphaDownAlt, BsSortAlphaDown, BsEyeFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FILES } from "../../utils/apollo/apolloQueries";
import { FILE_DOWNLOAD } from "../../utils/apollo/apolloMutations";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const dataFiltering = (data, category, searchValue, filterValue) => {
  let temporaryData = data.files;

  if (searchValue) {
    temporaryData = temporaryData.filter((file) =>
      file.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (category) {
    temporaryData = temporaryData.filter((file) => file.category === category);
  }

  temporaryData.sort((a, b) => {
    if (filterValue) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const res = temporaryData.reduce((grouped, obj) => {
    const subcategory = obj.subcategory;
    if (!grouped[subcategory]) {
      grouped[subcategory] = [];
    }
    grouped[subcategory].push(obj);
    return grouped;
  }, {});

  return Object.entries(res).map(([key, value]) => ({
    key,
    value,
  }));
};

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Dostawy");
  const [results, setResults] = useState();
  const [searchValue, setSearchValue] = useState(null);
  const [filterValue, setFilterValue] = useState(true);
  const [error, setError] = useState();
  const [downloading, setDownloading] = useState(false);
  const { data, loading } = useQuery(GET_FILES, {
    onError: (error) => setError(error),
  });
  const [fileDownload] = useMutation(FILE_DOWNLOAD, {
    onError: (error) => setError(error),
  });

  const categoryValueChange = (event) => {
    setCategory(event.target.value);
  };
  const searchValueChange = (event) => {
    setSearchValue(event.target.value);
  };
  const filterValueChange = (event) => {
    setFilterValue(filterValue ? false : true);
  };

  const downloadHandler = async (link, filename) => {
    setDownloading(true);
    fileDownload({
      variables: {
        filename: filename,
      },
    })
      .then((data) => {
        setDownloading(false);
        window.open(data.data.fileDownload, "_blank", "noreferrer");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!data) return;

    if (results) {
      setResults(dataFiltering(data, category, searchValue, filterValue));
    } else {
      setResults(dataFiltering(data, category, searchValue, filterValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchValue, filterValue, data]);

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox} onClick={() => navigate("/main")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      <main>
        <h1>Dokumenty</h1>
        <div className={style.menu}>
          <input
            type="text"
            placeholder="Wpisz nazwę..."
            onChange={searchValueChange}
          />
          <div className={style.selectBox}>
            <select className={style.select} onChange={categoryValueChange}>
              <option>Dostawy</option>
              <option>Zamówienia</option>
              <option>Listy przewozowe</option>
              <option>Inne</option>
            </select>
          </div>

          <button onClick={filterValueChange}>
            {!filterValue ? (
              <BsSortAlphaDownAlt className={style.icon} />
            ) : (
              <BsSortAlphaDown className={style.icon} />
            )}
          </button>
        </div>
        <div className={style.files}>
          <h2>{category}</h2>
          {results &&
            !downloading &&
            results.map((group) => (
              <div className={style.groupBox}>
                <h3>{group.key}</h3>
                <div>
                  {group.value.map((file) => (
                    <div className={style.filesBox}>
                      <img
                        src={require("../../assets/PDF_file_icon.png")}
                        alt="pdf icon"
                        className={style.image}
                      />
                      <div className={style.wrapper}>
                        <div className={style.upperBox}>
                          <p>{file.name}</p>
                          <button>
                            <BsEyeFill
                              className={style.icon}
                              onClick={() =>
                                downloadHandler(file.link, file.filename)
                              }
                            />
                            {/* <a
                              href="http://localhost:3001/5d75d0db-12e7-4440-95a3-6d96c7dc7d62.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              
                            </a> */}
                          </button>
                        </div>
                        <p className={style.date}>{file.date.split("T")[0]}</p>
                        <h5>{file.filename}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {(!results && loading) ||
            (downloading && (
              <div className={style.spinnerBox}>
                <div className={style.spinner}>
                  <Spinner />
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
